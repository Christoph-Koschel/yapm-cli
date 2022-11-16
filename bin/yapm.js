#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("fast-cli/src/parser");
const handler_1 = require("fast-cli/src/handler");
const input_1 = require("fast-cli/src/input");
const types_1 = require("yapm/src/types");
const project_1 = require("yapm/src/project");
const bundler_1 = require("yapm/src/bundler");
console.log(process.argv);
const cli = new parser_1.CLI(process.argv);
const cwd = process.cwd();
class Init extends handler_1.Command {
    async execute(argv) {
        console.log("Project name?");
        const name = await (0, input_1.readline)();
        console.log("Version? (1.0.0)");
        let version = await (0, input_1.readline)();
        if (version == "") {
            version = "1.0.0";
        }
        console.log("Author?");
        const author = await (0, input_1.readline)();
        console.log("Version? (MIT)");
        let license = await (0, input_1.readline)();
        if (license == "") {
            license = "MIT";
        }
        const temp = Object.assign({}, types_1.YAPM_TEMPLATE);
        temp.name = name;
        temp.version = version;
        temp.license = license;
        temp.author = author;
        (0, project_1.writeConfig)(cwd, temp);
        return 0;
    }
    getCMD() {
        return new handler_1.CommandConstructor("init");
    }
    getDescription() {
        return "Init a new yapm file";
    }
}
class Pack extends handler_1.Command {
    async execute(argv) {
        (0, bundler_1.createPackage)(cwd);
        return 0;
    }
    getCMD() {
        return new handler_1.CommandConstructor("pack")
            .addAttribute("-o", "dest", true, "Output of the package");
    }
    getDescription() {
        return "Packs the project to a tar file who can interpret the yapm installer";
    }
}
cli.register(new Init());
cli.register(new Pack());
cli.exec().then((c) => {
    process.exit(c);
});
//# sourceMappingURL=yapm.js.map