import path from 'path'
import fs from 'fs'

const createPackageJson = (name: string) => {
    return {
        name,
        version: '1.0.0',
        description: '',
        main: 'index.js',
        scripts: {
            "dev": "cross-env NODE_ENV=development webpack serve",
            "build": "cross-env NODE_ENV=production webpack"
        },
        keywords: [],
        author: '',
        license: 'ISC',
        browserslist: [
            "last 2 versions",
            "> 1%",
            "not dead",
        ],
    }
}

const copyDirSync = (src: string, dest: string) => {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest)
    }
    (function copy(src: string, dest: string) {
        fs.readdirSync(src, {
            withFileTypes: true,
        }).forEach((dir) => {
            (function(src, dest) {
                if (dir.isDirectory()) {
                    if (!fs.existsSync(dest)) {
                        fs.mkdirSync(dest)
                    }
                    copy(src, dest)
                }
                else {
                    fs.copyFileSync(src, dest)
                }
            })(path.resolve(src, dir.name), path.resolve(dest, dir.name))
        })
    })(src, dest)
}

const getArgs = (argv: string[]) => {
    const args: Record<string, string | boolean> = {}
    argv.forEach((arg) => {
        if (arg.startsWith('--')) {
            const [key, value] = arg.substring('--'.length).split('=')
            args[key] = value ?? true
        }
        else if (arg.startsWith('-')) {
            arg.substring('-'.length).split('').forEach((key) => {
                args[key] = true
            })
        }
        else {
            args[arg] = arg
        }
    })
    return args
}

const create = () => {
    const [,,name = '',...rest] = process.argv
    const args = getArgs(rest)
    if (name !== '') {
        const encoding = 'utf-8'
        const cwd = process.cwd()
        const root = path.resolve(cwd, name)
        const template = args.template ?? 'vue2.6'
        const templatePath = path.resolve(__dirname, `../lib/templates/${template}`)
        if (fs.existsSync(templatePath)) {
            if (!fs.existsSync(root)) {
                fs.mkdirSync(root)
            }
            const packageJson = {
                ...createPackageJson(name),
                ...JSON.parse(fs.readFileSync(path.resolve(templatePath, 'package.json'), {
                    encoding,
                })),
            }
            fs.writeFileSync(path.resolve(root, 'package.json'), JSON.stringify(packageJson, null, '  '), {
                encoding,
            })
            copyDirSync(path.resolve(templatePath, 'files'), root)
            console.log('success')
        }
    }
}

const version = () => {
    const encoding = 'utf-8'
    console.log(JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), {
        encoding,
    })).version)
}

const [,,...argv] = process.argv
const args = getArgs(argv)
if (args.v || args.version) {
    version()
}
else {
    create()
}
