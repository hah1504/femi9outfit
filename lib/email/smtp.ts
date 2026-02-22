import net from 'node:net'
import tls from 'node:tls'

type SocketLike = net.Socket | tls.TLSSocket

interface SmtpConfig {
  host: string
  port: number
  user: string
  pass: string
  secure: boolean
  fromEmail: string
  fromName?: string
}

interface MailPayload {
  to: string
  subject: string
  text: string
}

function getSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const fromEmail = process.env.SMTP_FROM_EMAIL
  const fromName = process.env.SMTP_FROM_NAME
  const secure = process.env.SMTP_SECURE === 'true' || port === 465

  if (!host || !user || !pass || !fromEmail) {
    return null
  }

  return { host, port, user, pass, secure, fromEmail, fromName }
}

function formatAddress(email: string, name?: string) {
  if (!name) return `<${email}>`
  return `"${name.replace(/"/g, '\\"')}" <${email}>`
}

class SmtpLineReader {
  private readonly socket: SocketLike
  private buffer = ''
  private lines: string[] = []
  private waiting: ((line: string) => void) | null = null

  constructor(socket: SocketLike) {
    this.socket = socket
    this.socket.on('data', (chunk: Buffer) => {
      this.buffer += chunk.toString('utf8')
      this.flush()
    })
  }

  private flush() {
    const parts = this.buffer.split(/\r\n/)
    this.buffer = parts.pop() || ''
    for (const line of parts) {
      if (!line) continue
      if (this.waiting) {
        const resolve = this.waiting
        this.waiting = null
        resolve(line)
      } else {
        this.lines.push(line)
      }
    }
  }

  async nextLine() {
    if (this.lines.length > 0) {
      return this.lines.shift() as string
    }

    return await new Promise<string>((resolve) => {
      this.waiting = resolve
    })
  }
}

async function connectSocket(config: SmtpConfig): Promise<SocketLike> {
  if (config.secure) {
    return await new Promise<tls.TLSSocket>((resolve, reject) => {
      const socket = tls.connect(
        {
          host: config.host,
          port: config.port,
          servername: config.host,
        },
        () => resolve(socket)
      )
      socket.once('error', reject)
    })
  }

  return await new Promise<net.Socket>((resolve, reject) => {
    const socket = net.connect(config.port, config.host, () => resolve(socket))
    socket.once('error', reject)
  })
}

async function upgradeToTls(socket: net.Socket, host: string): Promise<tls.TLSSocket> {
  return await new Promise<tls.TLSSocket>((resolve, reject) => {
    const secureSocket = tls.connect(
      {
        socket,
        servername: host,
      },
      () => resolve(secureSocket)
    )
    secureSocket.once('error', reject)
  })
}

async function readResponse(reader: SmtpLineReader) {
  const lines: string[] = []
  let code = 0

  while (true) {
    const line = await reader.nextLine()
    lines.push(line)
    const match = line.match(/^(\d{3})([ -])(.*)$/)
    if (!match) {
      continue
    }
    code = Number(match[1])
    const separator = match[2]
    if (separator === ' ') {
      return { code, message: lines.join('\n') }
    }
  }
}

async function sendCommand(
  socket: SocketLike,
  reader: SmtpLineReader,
  command: string,
  expectedCodes: number[]
) {
  socket.write(`${command}\r\n`)
  const response = await readResponse(reader)
  if (!expectedCodes.includes(response.code)) {
    throw new Error(`SMTP command failed (${command}): ${response.message}`)
  }
  return response
}

function toBase64(value: string) {
  return Buffer.from(value, 'utf8').toString('base64')
}

function normalizeBody(text: string) {
  // RFC 5321 dot-stuffing for lines that start with "."
  return text.replace(/\r?\n\./g, '\r\n..').replace(/\r?\n/g, '\r\n')
}

export async function sendSmtpMail(payload: MailPayload) {
  const config = getSmtpConfig()
  if (!config) {
    console.warn(
      'SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM_EMAIL.'
    )
    return { sent: false }
  }

  let socket = await connectSocket(config)
  let reader = new SmtpLineReader(socket)

  try {
    const greeting = await readResponse(reader)
    if (greeting.code !== 220) {
      throw new Error(`SMTP greeting failed: ${greeting.message}`)
    }

    await sendCommand(socket, reader, `EHLO ${config.host}`, [250])

    if (!config.secure) {
      await sendCommand(socket, reader, 'STARTTLS', [220])
      socket = await upgradeToTls(socket as net.Socket, config.host)
      reader = new SmtpLineReader(socket)
      await sendCommand(socket, reader, `EHLO ${config.host}`, [250])
    }

    await sendCommand(socket, reader, 'AUTH LOGIN', [334])
    await sendCommand(socket, reader, toBase64(config.user), [334])
    await sendCommand(socket, reader, toBase64(config.pass), [235])
    await sendCommand(socket, reader, `MAIL FROM:<${config.fromEmail}>`, [250])
    await sendCommand(socket, reader, `RCPT TO:<${payload.to}>`, [250, 251])
    await sendCommand(socket, reader, 'DATA', [354])

    const headers = [
      `From: ${formatAddress(config.fromEmail, config.fromName)}`,
      `To: <${payload.to}>`,
      `Subject: ${payload.subject}`,
      `Date: ${new Date().toUTCString()}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=UTF-8',
      '',
    ].join('\r\n')

    const message = `${headers}${normalizeBody(payload.text)}\r\n.\r\n`
    socket.write(message)

    const dataResponse = await readResponse(reader)
    if (dataResponse.code !== 250) {
      throw new Error(`SMTP DATA failed: ${dataResponse.message}`)
    }

    await sendCommand(socket, reader, 'QUIT', [221])
    socket.end()
    return { sent: true }
  } catch (error) {
    socket.destroy()
    throw error
  }
}
