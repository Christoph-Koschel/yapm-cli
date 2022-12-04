#!/usr/bin/env node

import {CLI} from "@yapm/fast-cli/1.0.0/parser";
import {ArgumentHandler, Command, CommandConstructor} from "@yapm/fast-cli/1.0.0/handler";
import {readline, decision, setPrefix} from "@yapm/fast-cli/1.0.0/input";
import {YAPM_TEMPLATE, YAPMConfig, YAPMRegister} from "@yapm/yapm/1.0.1/types";
import {readConfig, readRegisterConfig, writeConfig} from "@yapm/yapm/1.0.1/project";
import {createPackage} from "@yapm/yapm/1.0.1/bundler";
import {installPackage, uninstallPackage} from "@yapm/yapm/1.0.1/packages";
import * as output from "@yapm/fast-cli/1.0.0/output";
import * as fs from "fs";
import * as path from "path";
import {format} from "@yapm/code-database/1.0.0/text";

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

class Install extends Command {
    async execute(argv: ArgumentHandler): Promise<number> {
        let config = readConfig(cwd);

        if (argv.hasAttr("-p")) {
            const packageFile = <string>argv.getAttr("-p");
            const username: string | undefined = argv.hasAttr("-u") ? argv.getAttr("-u") : undefined;
            const version: string | undefined = argv.hasAttr("-v") ? argv.getAttr("-v") : undefined;

            await installPackage({
                packageName: packageFile,
                username: username,
                version: version
            }, cwd, (msg) => output.writeln_log(msg));
            return 0;
        }


        if (fs.existsSync(path.join(cwd, "lib")) && fs.statSync(path.join(cwd, "lib")).isDirectory()) {
            fs.rmSync(path.join(cwd, "lib"), {recursive: true});
        }

        output.writeln_log("Reinstall a packages");

        for (let dependency of config.dependencies) {
            await installPackage({
                packageName: dependency.resolve
            }, cwd, (msg) => output.writeln_log(msg));
        }
        return 0;
    }

    getCMD(): CommandConstructor {
        return new CommandConstructor("install")
            .addAttribute("-p", "package", true, "The package for installation")
            .addAttribute("-u", "user", true, "The username (is for example needed for GitHub)")
            .addAttribute("-v", "version", true, "The version of the package");
    }

    getDescription(): string {
        return "Install a package";
    }

}

cli.register(new Install());

class UnInstall extends Command {
    async execute(argv: ArgumentHandler): Promise<number> {
        const name = argv.getAttr("-p");
        const version = argv.getAttr("-v");
        const config: YAPMConfig = readConfig(cwd);

        for (let i = 0; i < config.dependencies.length; i++) {
            let dependency = config.dependencies[i];
            if (dependency.name == name && dependency.version == version) {
                uninstallPackage(cwd, name, version);
                config.dependencies = config.dependencies.slice(i, 1);
            }
        }

        writeConfig(cwd, config);
        return 0;
    }

    getCMD(): CommandConstructor {
        return new CommandConstructor("uninstall")
            .addAttribute("-p", "package", false, "The package name for uninstallation")
            .addAttribute("-v", "version", false, "The package version for uninstallation");
    }

    getDescription(): string {
        return "Uninstall a package";
    }

}

cli.register(new UnInstall());

class Pack extends Command {
    async execute(argv: ArgumentHandler): Promise<number> {
        createPackage(cwd, output.writeln_log);
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

class AddRegisters extends Command {
    async execute(argv: ArgumentHandler): Promise<number> {

        return 0;
    }

    getCMD(): CommandConstructor {
        return new CommandConstructor("register")
            .addFlag("--add", false, "Add a register")
            .addAttribute("-n", "name", false, "Name of the register")
            .addAttribute("-u", "url", false, "The resolve domain template")
            .addAttribute("-t", "type", false, "The type of the register (GIT|YAPM)");
    }

    getDescription(): string {
        return "Add register for resolving packages";
    }
}

cli.register(new AddRegisters());

class ListRegisters extends Command {
    async execute(argv: ArgumentHandler): Promise<number> {
        const reg: YAPMRegister[] = readRegisterConfig();

        reg.forEach((value, index, array) => {
            console.log(format(`(%-${array.length}s) %-8s : %-20s`, index.toString(), value.name, value.url));
        });

        return 0;
    }

    getCMD(): CommandConstructor {
        return new CommandConstructor("register")
            .addFlag("--list", false, "List the registered registers");
    }

    getDescription(): string {
        return "";
    }

}

cli.register(new ListRegisters());

class RemoveRegisters extends Command {
    async execute(argv: ArgumentHandler): Promise<number> {
        return 0;
    }

    getCMD(): CommandConstructor {
        return new CommandConstructor("register")
            .addFlag("--remove", false, "Removes a register")
            .addAttribute("-n", "name", false, "Name of the register");
    }

    getDescription(): string {
        return "Removes a register for resolving packages";
    }
}

cli.register(new RemoveRegisters());

cli.exec().then((c) => {
    process.exit(c);
});