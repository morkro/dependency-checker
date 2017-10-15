const chalk = require('chalk')

const isSafe = d => d.safe
const isUnsafe = d => !d.safe
const isDev = d => d.type === 'DEV'
const isPeer = d => d.type === 'PEER'
const isRegular = d => d.type === 'REGULAR'

const logLine = entry => {
  console.log(`* ${chalk.magenta(entry.name)} is currently in ${chalk.yellow(entry.range)} but ${chalk.blue(entry.latest)} is available.`)
}

const logCommand = (entries, type) => {
  if (entries.length === 0) {
    return
  }

  const mode = type === 'DEV'
    ? '--save-dev'
    : type === 'PEER' ? '--save-peer' : '--save'
  const command = entries.reduce((cmd, entry) => {
    return cmd + ' ' + entry.name
  }, `npm install ${mode}`)

  console.log(chalk.grey(command))
}

const display = entries => {
  const safe = entries.filter(isSafe)
  const unsafe = entries.filter(isUnsafe)

  console.log('Unsafe updates')
  console.log('==============')
  console.log(chalk.gray(
    'Major version bumps or any version bumps ' +
    'prior to the first major release (0.y.z).'
  ))
  console.log('')
  unsafe.forEach(logLine)
  console.log('')
  logCommand(unsafe.filter(isRegular), 'REGULAR')
  logCommand(unsafe.filter(isDev), 'DEV')
  logCommand(unsafe.filter(isPeer), 'PEER')
  console.log('')
  console.log('')

  console.log('Safe updates')
  console.log('============')
  console.log(chalk.gray('Minor and patch versions bumps.'))
  console.log('')
  safe.forEach(logLine)
  console.log('')
  logCommand(safe.filter(isRegular), 'REGULAR')
  logCommand(safe.filter(isDev), 'DEV')
  logCommand(safe.filter(isPeer), 'PEER')
  console.log('')
}

module.exports = display
