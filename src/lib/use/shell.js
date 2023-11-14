import * as tauriShell from '@tauri-apps/api/shell'

// -----------------------------------------------------------------------------
async function execute({
  cmd = '',
  sidecar = '',
  args = undefined,
  options = undefined,
  onStdout = msg => {},
  onStderr = msg => {},
  onError = msg => {}
}) {

  let command = null

  if (cmd)
    command = new tauriShell.Command(cmd, args, options)
  else if (sidecar)
    command = tauriShell.Command.sidecar(sidecar, args, options)
  else
    throw new Error('Define cmd or sidecar.')

  command.stdout.on('data', msg => onStdout(msg))
  command.stderr.on('data', msg => onStderr(msg))
  command.on('error', msg => onError(msg))

  let output = await command.execute()

  if (output.code !== 0) {
    onError(output.stderr)
  }

  return output
}

// -----------------------------------------------------------------------------
async function spawn({
  cmd = '',
  sidecar = '',
  args = undefined,
  options = undefined,
  onStdout = msg => {},
  onStderr = msg => {},
  onError = msg => {}
}) {

  let command = null

  if (cmd)
    command = new tauriShell.Command(cmd, args, options)
  else if (sidecar)
    command = tauriShell.Command.sidecar(sidecar, args, options)
  else
    throw new Error('Define cmd or sidecar.')

  command.stdout.on('data', msg => onStdout(msg))
  command.stderr.on('data', msg => onStderr(msg))
  command.on('error', msg => onError(msg))

  let child = await command.spawn()
  return child
}

// -----------------------------------------------------------------------------
async function open({
  path = '',
  openWith = undefined
}) {

  await tauriShell.open(path, openWith)
}

// -----------------------------------------------------------------------------
export default {
  execute,
  spawn,
  open
}
