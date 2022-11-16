#!/usr/bin/env node

import {CLI} from "fast-cli/src/parser";
import {ArgumentHandler, Command, CommandConstructor} from "fast-cli/src/handler";
import {readline, decision, setPrefix} from "fast-cli/src/input";
import {YAPM_TEMPLATE, YAPMConfig} from "yapm/src/types";
import {writeConfig} from "yapm/src/project";
import {createPackage} from "yapm/src/bundler";

console.log(process.argv);

const cli: CLI = new CLI(process.argv);

const cwd: string = process.cwd();

class Init extends Command {
    async execute(argv: ArgumentHandler): Promise<number> {
        console.log("Project name?");
        const name: string = await readline();

        console.log("Version? (1.0.0)");
        let version: string = await readline();
        if (version == "") {
            version = "1.0.0";
        }

        console.log("Author?");
        const author: string = await readline();

        console.log("Version? (MIT)");
        let license: string = await readline();
        if (license == "") {
            license = "MIT";
        }

        const temp: YAPMConfig = Object.assign({}, YAPM_TEMPLATE);
        temp.name = name;
        temp.version = version;
        temp.license = license;
        temp.author = author;

        writeConfig(cwd, temp);

        return 0;
    }

    getCMD(): CommandConstructor {
        return new CommandConstructor("init");
    }

    getDescription(): string {
        return "Init a new yapm file";
    }
}

class Pack extends Command {
    async execute(argv: ArgumentHandler): Promise<number> {
        // TODO yapm package creator files in subfolders are not correctly packed
        // TODO yapm package creator should ignore .tar files
        createPackage(cwd);
        return 0;
    }

    getCMD(): CommandConstructor {
        return new CommandConstructor("pack")
            .addAttribute("-o", "dest", true, "Output of the package");
    }

    getDescription(): string {
        return "Packs the project to a tar file who can interpret the yapm installer";
    }
}

cli.register(new Init());
cli.register(new Pack());

cli.exec().then((c) => {
    process.exit(c);
});