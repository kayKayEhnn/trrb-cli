const commander = require('commander')
const chalk = require('chalk').default
const table = require('table').table

const newCommand = require('./new')
const generateCommand = require('./generate')

const packageJson = require('../package.json')
const { version } = packageJson

const program = new commander.Command()

program
  .version(version, '-v, --version')
  .usage(`${chalk.green('<command>')} [options]`)

program
  .command('new')
  .alias('n')
  .option('--no-commit', 'Skip creating an initial commit')
  .arguments('<project-directory>')
  .description('Initialize a new project')
  .action(newCommand)

program
  .command('generate <type> <name>')
  .alias('g')
  .option('--no-format', 'Preserves name formatting')
  .option('-d, --dry-run', 'Doesn\'t write anything to the file system')
  .option('-c, --component <name>', 'Link a presentational component to a container')
  .description('Generate new file from schematic.')
  .allowUnknownOption()
  .action(generateCommand)

program.on('--help', () => {
  const { schematicAliases } = generateCommand
  const data = [
    ['Schematic', 'Aliases'],
    ...Object.entries(schematicAliases).map(([type, aliases]) => {
      return [chalk.cyan(type), aliases.map(a => chalk.cyan(a)).join(', ')]
    })
  ]

  console.log()
  console.log('Available schematics types:')
  console.log(table(data))
})

program
  .parse(process.argv)

if (program.args.length === 0) {
  program.help()
}
