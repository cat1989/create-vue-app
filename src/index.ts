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

const [,,name = ''] = process.argv
if (name === '') {
    process.exit()
}
else {
    const encoding = 'utf-8'
    const cwd = process.cwd()
    const root = path.resolve(cwd, name)
    if (!fs.existsSync(root)) {
        fs.mkdirSync(root)
    }
    const template = path.resolve(__dirname, '../lib/templates/vue2.6')
    const packageJson = {
        ...createPackageJson(name),
        ...JSON.parse(fs.readFileSync(path.resolve(template, 'package.json'), {
            encoding,
        })),
    }
    fs.writeFileSync(path.resolve(root, 'package.json'), JSON.stringify(packageJson, null, '  '), {
        encoding,
    })
    copyDirSync(path.resolve(template, 'files'), root)
    console.log('success')
}
