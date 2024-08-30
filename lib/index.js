"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const createPackageJson = (name) => {
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
    };
};
const copyDirSync = (src, dest) => {
    if (!fs_1.default.existsSync(dest)) {
        fs_1.default.mkdirSync(dest);
    }
    (function copy(src, dest) {
        fs_1.default.readdirSync(src, {
            withFileTypes: true,
        }).forEach((dir) => {
            (function (src, dest) {
                if (dir.isDirectory()) {
                    if (!fs_1.default.existsSync(dest)) {
                        fs_1.default.mkdirSync(dest);
                    }
                    copy(src, dest);
                }
                else {
                    fs_1.default.copyFileSync(src, dest);
                }
            })(path_1.default.resolve(src, dir.name), path_1.default.resolve(dest, dir.name));
        });
    })(src, dest);
};
const getArgs = (argv) => {
    const args = {};
    argv.forEach((arg) => {
        if (arg.startsWith('--')) {
            const [key, value] = arg.substring('--'.length).split('=');
            args[key] = value !== null && value !== void 0 ? value : true;
        }
        else if (arg.startsWith('-')) {
            arg.substring('-'.length).split('').forEach((key) => {
                args[key] = true;
            });
        }
        else {
            args[arg] = arg;
        }
    });
    return args;
};
const create = () => {
    var _a;
    const [, , name = '', ...rest] = process.argv;
    const args = getArgs(rest);
    if (name !== '') {
        const encoding = 'utf-8';
        const cwd = process.cwd();
        const root = path_1.default.resolve(cwd, name);
        const template = (_a = args.template) !== null && _a !== void 0 ? _a : 'vue2.6';
        const templatePath = path_1.default.resolve(__dirname, `../lib/templates/${template}`);
        if (fs_1.default.existsSync(templatePath)) {
            if (!fs_1.default.existsSync(root)) {
                fs_1.default.mkdirSync(root);
            }
            const packageJson = Object.assign(Object.assign({}, createPackageJson(name)), JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(templatePath, 'package.json'), {
                encoding,
            })));
            fs_1.default.writeFileSync(path_1.default.resolve(root, 'package.json'), JSON.stringify(packageJson, null, '  '), {
                encoding,
            });
            copyDirSync(path_1.default.resolve(templatePath, 'files'), root);
            console.log('success');
        }
    }
};
const version = () => {
    const encoding = 'utf-8';
    console.log(JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../package.json'), {
        encoding,
    })).version);
};
const [, , ...argv] = process.argv;
const args = getArgs(argv);
if (args.v || args.version) {
    version();
}
else {
    create();
}
