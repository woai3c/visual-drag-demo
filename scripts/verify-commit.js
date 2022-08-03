// eslint-disable-next-line import/no-extraneous-dependencies
const chalk = require('chalk')

const msgPath = process.argv[2]
const msg = require('fs')
.readFileSync(msgPath, 'utf-8')
.trim()

const commitRE = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|release)(\(.+\))?: .{1,50}/

if (!commitRE.test(msg)) {
    console.log()
    console.error(
        `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(
            '不合法的 commit 消息格式',
        )}\n\n`
          + chalk.red(
              '  请使用正确的提交格式:\n\n',
          )
          + `    ${chalk.green('feat: add \'comments\' option')}\n`
          + `    ${chalk.green('fix: handle events on blur (close #28)')}\n\n`
          + chalk.red('  请查看 git commit 提交规范：https://github.com/woai3c/Front-end-articles/blob/master/git%20commit%20style.md。\n'),
    )

    process.exit(1)
}
