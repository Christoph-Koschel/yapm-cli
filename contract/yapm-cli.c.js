#!/usr/bin/env node
"use strict";

class TSBundler {
    constructor() {
        this.loaded = new Map();
        this.modules = new Map();
        this.autoload = [];
    }

    define(name, imports, cb) {
        this.modules.set(name, {
            imports: imports,
            cb: cb
        });
    }

    load(name) {
        this.autoload.push(name);
    }

    async start() {
        for (const load of this.autoload) {
            await this.loadPackage(load);
        }
    }

    async loadPackage(name) {
        if (this.modules.has(name)) {
            if (this.loaded.has(name)) {
                return this.loaded.get(name);
            }
            let mod = this.modules.get(name);
            if (mod == undefined) {
                return {};
            }
            let __import = {};
            for (const req of mod.imports) {
                let reqImport = await this.loadPackage(req);
                Object.keys(reqImport).forEach((value) => {
                    __import[value] = reqImport[value];
                });
            }
            let __export = {};
            await mod.cb(__export, __import);
            this.loaded.set(name, __export);
            return __export;
        } else {
            throw "No package with the id \"" + name + "\" defined";
        }
    }
}

const bundler = new TSBundler();
bundler.define("1.0.0/code-database/0", [], async (__export, __import) => {
	function select(items) {
	    items = items.slice();
	    return constructTypeSection(items);
	}
	function constructTypeSection(items) {
	    return {
	        first: () => first(items),
	        all: () => all(items),
	        last: () => last(items)
	    };
	}
	function first(items) {
	    const receiver = (x) => x.shift();
	    return {
	        ...constructPrefixCondition(items, receiver),
	        ...constructConditionSection(items, () => true, receiver),
	        ...constructReturnSection(items.shift())
	    };
	}
	function all(items) {
	    const receiver = (x) => x;
	    return {
	        ...constructPrefixCondition(items, receiver),
	        ...constructConditionSection(items, () => true, receiver),
	        ...constructReturnSection(items)
	    };
	}
	function last(items) {
	    const receiver = (x) => x.pop();
	    return {
	        ...constructPrefixCondition(items, receiver),
	        ...constructConditionSection(items, () => true, receiver),
	        ...constructReturnSection(items.pop())
	    };
	}
	function constructPrefixCondition(items, receiver) {
	    return {
	        not: () => not(items, receiver)
	    };
	}
	function not(items, receiver) {
	    return constructConditionSection(items, () => false, receiver);
	}
	function constructConditionSection(items, expect, receiver) {
	    return {
	        where: (cb) => where(items, cb, expect, receiver),
	        until: (cb) => until(items, cb, expect, receiver)
	    };
	}
	function where(items, cb, expect, receiver) {
	    let result = [];
	    for (let i = 0; i < items.length; i++) {
	        let item = items[i];
	        if (cb(item, i) == expect(item, i)) {
	            result.push(item);
	        }
	    }
	    return {
	        ...constructReturnSection(receiver(result))
	    };
	}
	function until(items, cb, expect, receiver) {
	    let result = [];
	    for (let i = 0; i < items.length; i++) {
	        let item = items[i];
	        if (cb(item, i) == expect(item, i)) {
	            break;
	        }
	        result.push(item);
	    }
	    return constructReturnSection(receiver(result));
	}
	function constructReturnSection(result) {
	    return {
	        toList: () => toList(result),
	        get: () => get(result)
	    };
	}
	function toList(items) {
	    return [items];
	}
	function get(items) {
	    return items;
	}
	
	__export["1.0.0/code-database/0"] = {};
	__export["1.0.0/code-database/0"].select = select;
});
bundler.define("1.0.0/code-database/1", [], async (__export, __import) => {
	function rand(min, max) {
	    return Math.floor(Math.random() * (max - min)) + max;
	}
	function randF(min, max) {
	    return Math.floor(Math.random() * (max - min)) + max;
	}
	function isInt(num) {
	    return num % 1 == 0;
	}
	function isFloat(num) {
	    return !isInt(num);
	}
	
	__export["1.0.0/code-database/1"] = {};
	__export["1.0.0/code-database/1"].rand = rand;
	__export["1.0.0/code-database/1"].randF = randF;
	__export["1.0.0/code-database/1"].isInt = isInt;
	__export["1.0.0/code-database/1"].isFloat = isFloat;
});
bundler.define("1.0.0/code-database/2", [], async (__export, __import) => {
	const REF = "";
	
	__export["1.0.0/code-database/2"] = {};
	__export["1.0.0/code-database/2"].REF = REF;
});
bundler.define("1.0.0/code-database/3", [], async (__export, __import) => {
	function isNumber(char) {
	    if (typeof char !== 'string') {
	        return false;
	    }
	    if (char.trim() === '') {
	        return false;
	    }
	    return !isNaN(Number(char));
	}
	function format(tmp, ...items) {
	    let chars = tmp.split("");
	    let res = "";
	    let itemIndex = 0;
	    for (let i = 0; i < chars.length; i++) {
	        let char = chars[i];
	        if (char == "\\") {
	            if (chars[i + 1] == "%") {
	                res += char;
	                res += chars[i + 1];
	                i++;
	                continue;
	            }
	        }
	        if (char == "%") {
	            if (chars[i + 1] == "n") {
	                res += "\n";
	                i++;
	                continue;
	            }
	            let operator;
	            let space = 0;
	            let doSpace = false;
	            if (chars[i + 1] == "+" || chars[i + 1] == "-") {
	                operator = chars[i + 1];
	                if (!isNumber(chars[i + 2])) {
	                    res += char;
	                    res += chars[i + 1];
	                    res += chars[i + 2];
	                    i += 2;
	                    continue;
	                }
	                let numStr = "";
	                i += 2;
	                while (i < chars.length && isNumber(chars[i])) {
	                    numStr += chars[i];
	                    i++;
	                }
	                doSpace = true;
	                space = parseInt(numStr);
	            }
	            else {
	                i++;
	            }
	            if (chars[i] != "s") {
	                res += operator;
	                res += space.toString();
	                res += "s";
	                i++;
	                continue;
	            }
	            let item = items[itemIndex];
	            itemIndex++;
	            if (doSpace && item.length < space) {
	                let size = space - item.length;
	                item = operator == "-" ? " ".repeat(size) + item : item + " ".repeat(size);
	            }
	            res += item;
	            continue;
	        }
	        res += char;
	    }
	    return res;
	}
	
	__export["1.0.0/code-database/3"] = {};
	__export["1.0.0/code-database/3"].isNumber = isNumber;
	__export["1.0.0/code-database/3"].format = format;
});
bundler.define("1.0.0/fast-cli/0", [], async (__export, __import) => {
	class ArgumentHandler {
	    constructor(flags, attrs) {
	        this.flags = flags;
	        this.attrs = attrs;
	    }
	    hasFlag(name) {
	        for (let flag of this.flags) {
	            if (flag.name == name) {
	                return true;
	            }
	        }
	        return false;
	    }
	    hasAttr(name) {
	        for (let attr of this.attrs) {
	            if (attr.name == name) {
	                return true;
	            }
	        }
	        return false;
	    }
	    getAttr(name) {
	        for (let attr of this.attrs) {
	            if (attr.name == name) {
	                return attr.value;
	            }
	        }
	        return null;
	    }
	    flagLength() {
	        return this.flags.length;
	    }
	    attrLength() {
	        return this.attrs.length;
	    }
	}
	class ArgumentFlag {
	    constructor(name) {
	        this.name = name;
	    }
	}
	class ArgumentAttribute {
	    constructor(name, value) {
	        this.name = name;
	        this.value = value;
	    }
	}
	class Command {
	}
	class CommandConstructor {
	    constructor(name) {
	        this.name = name;
	        this.flags = [];
	        this.attrs = [];
	    }
	    addFlag(name, optional, description) {
	        this.flags.push(new CommandFlag(name, optional, description));
	        return this;
	    }
	    addAttribute(char, name, optional, description) {
	        this.attrs.push(new CommandAttribute(char, name, optional, description));
	        return this;
	    }
	    getName() {
	        return this.name;
	    }
	    equals(name, argv) {
	        if (name != this.name) {
	            return false;
	        }
	        for (let attr of this.attrs) {
	            if (attr.optional) {
	                continue;
	            }
	            if (!argv.hasAttr(attr.char)) {
	                return false;
	            }
	        }
	        for (let flag of this.flags) {
	            if (flag.optional) {
	                continue;
	            }
	            if (!argv.hasFlag(flag.name)) {
	                return false;
	            }
	        }
	        return true;
	    }
	    toString(cmd) {
	        let str = this.name + " ";
	        for (let attr of this.attrs) {
	            if (!attr.optional) {
	                str += attr.char + " <" + attr.name + "> ";
	            }
	        }
	        for (let attr of this.attrs) {
	            if (attr.optional) {
	                str += "[" + attr.char + " <" + attr.name + ">] ";
	            }
	        }
	        for (let flag of this.flags) {
	            if (!flag.optional) {
	                str += flag.name + " ";
	            }
	        }
	        for (let flag of this.flags) {
	            if (flag.optional) {
	                str += "[" + flag.name + "] ";
	            }
	        }
	        str += "\n\n";
	        str += cmd.getDescription();
	        str += "\n\n";
	        let size = this.calcSize();
	        for (let attr of this.attrs) {
	            str += attr.char + " ".repeat(size - attr.char.length) + (attr.optional ? "  [OPTIONAL]" : "") + "   " + attr.description + "\n";
	        }
	        for (let flags of this.flags) {
	            str += flags.name + " ".repeat(size - flags.name.length) + (flags.optional ? "  [OPTIONAL]" : "") + "   " + flags.description + "\n";
	        }
	        return str;
	    }
	    calcSize() {
	        let size = 0;
	        this.flags.forEach((x) => {
	            if (x.name.length > size) {
	                size = x.name.length;
	            }
	        });
	        this.attrs.forEach((x) => {
	            if (x.char.length > size) {
	                size = x.char.length;
	            }
	        });
	        return size;
	    }
	}
	class CommandFlag {
	    constructor(name, optional, description) {
	        this.name = name;
	        this.optional = optional;
	        this.description = description;
	    }
	}
	class CommandAttribute {
	    constructor(char, name, optional, description) {
	        this.char = char;
	        this.name = name;
	        this.optional = optional;
	        this.description = description;
	    }
	}
	
	__export["1.0.0/fast-cli/0"] = {};
	__export["1.0.0/fast-cli/0"].ArgumentHandler = ArgumentHandler;
	__export["1.0.0/fast-cli/0"].ArgumentFlag = ArgumentFlag;
	__export["1.0.0/fast-cli/0"].ArgumentAttribute = ArgumentAttribute;
	__export["1.0.0/fast-cli/0"].Command = Command;
	__export["1.0.0/fast-cli/0"].CommandConstructor = CommandConstructor;
	__export["1.0.0/fast-cli/0"].CommandFlag = CommandFlag;
	__export["1.0.0/fast-cli/0"].CommandAttribute = CommandAttribute;
});
bundler.define("1.0.0/fast-cli/1", [], async (__export, __import) => {
	const os = require("os");
	
	let prefix = "";
	function setPrefix(x) {
	    prefix = x;
	}
	async function readline() {
	    return new Promise((resolve) => {
	        process.stdout.write(prefix);
	        process.stdin.once("data", (x) => {
	            let str = x.toString("ascii");
	            resolve(str.substring(0, str.length - os.EOL.length));
	        });
	    });
	}
	async function decision() {
	    return new Promise(async (resolve) => {
	        while (true) {
	            const str = await readline();
	            if (str.toLowerCase() == "y" || str.toLowerCase() == "yes") {
	                resolve(true);
	                break;
	            }
	            else if (str.toLowerCase() == "n" || str.toLowerCase() == "no") {
	                resolve(false);
	                break;
	            }
	        }
	    });
	}
	
	__export["1.0.0/fast-cli/1"] = {};
	__export["1.0.0/fast-cli/1"].readline = readline;
	__export["1.0.0/fast-cli/1"].decision = decision;
});
bundler.define("1.0.0/fast-cli/2", [], async (__export, __import) => {
	var Colors;
	(function (Colors) {
	    Colors["RED"] = "\u001B[31m";
	    Colors["GREEN"] = "\u001B[32m";
	    Colors["YELLOW"] = "\u001B[33m";
	    Colors["BLUE"] = "\u001B[34m";
	    Colors["MAGENTA"] = "\u001B[35m";
	    Colors["CYAN"] = "\u001B[36m";
	    Colors["GRAY"] = "\u001B[37m";
	})(Colors || (Colors = {}));
	const RESET = "\x1b[30m";
	let INFO = Colors.CYAN;
	let ERROR = Colors.RED;
	let LOG = Colors.GRAY;
	let PREFIX_SPACE = 8;
	function set_colors(info, error, log) {
	    INFO = info;
	    ERROR = error;
	    LOG = log;
	}
	function get_colors() {
	    return {
	        info: INFO,
	        error: ERROR,
	        log: LOG
	    };
	}
	function writeln_info(message, ignorePrefix = false) {
	    write_info(message + "\n", ignorePrefix);
	}
	function write_info(message, ignorePrefix = false) {
	    write(INFO, ignorePrefix ? "" : "INFO:", message);
	}
	function writeln_error(message, ignorePrefix = false) {
	    write_error(message + "\n", ignorePrefix);
	}
	function write_error(message, ignorePrefix = false) {
	    write(ERROR, ignorePrefix ? "" : "ERROR:", message);
	}
	function writeln_log(message, ignorePrefix = false) {
	    write_log(message + "\n", ignorePrefix);
	}
	function write_log(message, ignorePrefix = false) {
	    write(LOG, ignorePrefix ? "" : "LOG:", message);
	}
	function write(code, prefix, message) {
	    process.stdout.write(code);
	    process.stdout.write(prefix + (" ".repeat(PREFIX_SPACE - prefix.length)));
	    process.stdout.write(message);
	    process.stdout.write(RESET);
	}
	
	__export["1.0.0/fast-cli/2"] = {};
	__export["1.0.0/fast-cli/2"].Colors = Colors;
	__export["1.0.0/fast-cli/2"].set_colors = set_colors;
	__export["1.0.0/fast-cli/2"].get_colors = get_colors;
	__export["1.0.0/fast-cli/2"].writeln_info = writeln_info;
	__export["1.0.0/fast-cli/2"].write_info = write_info;
	__export["1.0.0/fast-cli/2"].writeln_error = writeln_error;
	__export["1.0.0/fast-cli/2"].write_error = write_error;
	__export["1.0.0/fast-cli/2"].writeln_log = writeln_log;
	__export["1.0.0/fast-cli/2"].write_log = write_log;
});
bundler.define("1.0.0/fast-cli/3", ["1.0.0/fast-cli/0"], async (__export, __import) => {
	const ArgumentAttribute = __import["1.0.0/fast-cli/0"].ArgumentAttribute;
	const ArgumentFlag = __import["1.0.0/fast-cli/0"].ArgumentFlag;
	const ArgumentHandler = __import["1.0.0/fast-cli/0"].ArgumentHandler;
	
	class CLI {
	    constructor(args) {
	        args.shift();
	        args.shift();
	        this.args = args;
	        this.cmds = [];
	    }
	    register(cmd) {
	        this.cmds.push(cmd);
	    }
	    async exec() {
	        const cmdName = this.args[0].startsWith("-") ? null : this.args.shift();
	        const argumentHandler = this.buildArguments();
	        const isHelp = argumentHandler.hasFlag("--help");
	        if (isHelp && cmdName == null && argumentHandler.attrLength() == 0 && argumentHandler.flagLength() == 1) {
	            this.printGlobalHelp();
	            return 0;
	        }
	        else if (cmdName == null) {
	            this.printCommandNotFound();
	            return 1;
	        }
	        if (isHelp) {
	            let cmds = [];
	            for (let cmd of this.cmds) {
	                let command = cmd.getCMD();
	                if (command.getName() == cmdName) {
	                    cmds.push(cmd);
	                }
	            }
	            console.log("Found " + cmds.length + " commands\n");
	            cmds.forEach(cmd => {
	                console.log(cmd.getCMD().toString(cmd));
	                console.log("\n");
	            });
	        }
	        else {
	            for (let cmd of this.cmds) {
	                let command = cmd.getCMD();
	                if (command.equals(cmdName, argumentHandler)) {
	                    return await cmd.execute(argumentHandler);
	                }
	            }
	        }
	        this.printCommandNotFound();
	        return 1;
	    }
	    buildArguments() {
	        const attrs = [];
	        const flags = [];
	        this.args.forEach((value, index) => {
	            if (value.startsWith("-") && !this.isFlag(value)) {
	                for (let i = index; i < this.args.length; i++) {
	                    if (!this.isFlag(value)) {
	                        attrs.push(new ArgumentAttribute(value, this.args[i + 1]));
	                        break;
	                    }
	                }
	            }
	            else if (this.isFlag(value)) {
	                flags.push(new ArgumentFlag(value));
	            }
	        });
	        return new ArgumentHandler(flags, attrs);
	    }
	    isFlag(x) {
	        return x.startsWith("--");
	    }
	    printGlobalHelp() {
	        let group = [];
	        for (let cmd of this.cmds) {
	            let edit = false;
	            for (let groupElement of group) {
	                if (groupElement.name == cmd.getCMD().getName()) {
	                    groupElement.overflow++;
	                    edit = true;
	                }
	            }
	            if (!edit) {
	                group.push({
	                    name: cmd.getCMD().getName(),
	                    overflow: 0
	                });
	            }
	        }
	        group = group.sort((a, b) => a.name < b.name ? -1 : 1);
	        for (let groupElement of group) {
	            process.stdout.write(`${groupElement.name} `);
	        }
	    }
	    printCommandNotFound() {
	    }
	}
	
	__export["1.0.0/fast-cli/3"] = {};
	__export["1.0.0/fast-cli/3"].CLI = CLI;
});
bundler.define("1.0.1/yapm/2", ["1.0.1/yapm/0", "1.0.1/yapm/1"], async (__export, __import) => {
	const checkCWD = __import["1.0.1/yapm/0"].checkCWD;
	const checkProjectConfigExists = __import["1.0.1/yapm/0"].checkProjectConfigExists;
	const readConfig = __import["1.0.1/yapm/1"].readConfig;
	const AdmZip = require("adm-zip");
	const path = require("path");
	const fs = require("fs");
	
	
	
	
	
	function createPackage(cwd, out) {
	    checkCWD(cwd);
	    checkProjectConfigExists(cwd);
	    out("==== PACK PROJECT ====");
	    let config = readConfig(cwd);
	    let zip = new AdmZip();
	    fs.readdirSync(cwd).forEach(value => {
	        if (value != "lib" && !value.endsWith(".yapm.tar")) {
	            let entry = path.join(cwd, value);
	            out(`Include: "${entry}"`);
	            if (fs.statSync(entry).isFile()) {
	                zip.addLocalFile(entry);
	            }
	            else if (fs.statSync(entry).isDirectory()) {
	                zip.addLocalFolder(entry, value);
	            }
	        }
	    });
	    out("Write tarball...");
	    const outFile = path.join(cwd, config.name + "-" + config.version.replace(/\./gi, "-") + ".yapm.tgz");
	    zip.writeZip(outFile);
	    out("Package created");
	    return outFile;
	}
	
	__export["1.0.1/yapm/2"] = {};
	__export["1.0.1/yapm/2"].createPackage = createPackage;
});
bundler.define("1.0.1/yapm/3", [], async (__export, __import) => {
	class WrongFormatException extends Error {
	    constructor(message) {
	        super(message);
	    }
	}
	class StructureException extends Error {
	    constructor(message) {
	        super(message);
	    }
	}
	class FetchError extends Error {
	    constructor(message) {
	        super(message);
	    }
	}
	class ProjectInitException extends Error {
	    constructor(message) {
	        super(message);
	    }
	}
	class WebException extends Error {
	    constructor(message) {
	        super(message);
	    }
	}
	
	__export["1.0.1/yapm/3"] = {};
	__export["1.0.1/yapm/3"].WrongFormatException = WrongFormatException;
	__export["1.0.1/yapm/3"].StructureException = StructureException;
	__export["1.0.1/yapm/3"].FetchError = FetchError;
	__export["1.0.1/yapm/3"].ProjectInitException = ProjectInitException;
	__export["1.0.1/yapm/3"].WebException = WebException;
});
bundler.define("1.0.1/yapm/5", ["1.0.1/yapm/4", "1.0.1/yapm/0", "1.0.1/yapm/3", "1.0.1/yapm/1"], async (__export, __import) => {
	const depToConf = __import["1.0.1/yapm/4"].depToConf;
	const YAPM_TEMPLATE = __import["1.0.1/yapm/4"].YAPM_TEMPLATE;
	const checkLibData = __import["1.0.1/yapm/0"].checkLibData;
	const checkLibRoot = __import["1.0.1/yapm/0"].checkLibRoot;
	const libIsInstalled = __import["1.0.1/yapm/0"].libIsInstalled;
	const saveLib = __import["1.0.1/yapm/0"].saveLib;
	const FetchError = __import["1.0.1/yapm/3"].FetchError;
	const readConfig = __import["1.0.1/yapm/1"].readConfig;
	const readRegisterConfig = __import["1.0.1/yapm/1"].readRegisterConfig;
	const writeConfig = __import["1.0.1/yapm/1"].writeConfig;
	const AdmZip = require("adm-zip");
	const fs = require("fs");
	const url = require("url");
	const path = require("path");
	const os = require("os");
	const http = require("http");
	const child_process = require("child_process");
	
	
	
	
	
	
	
	
	
	
	
	function uninstallPackage(cwd, name, version) {
	    let config = readConfig(cwd);
	    let root = checkLibRoot(cwd);
	    const template = Object.assign({}, YAPM_TEMPLATE);
	    template.name = name;
	    template.version = version;
	    let libRoot = checkLibData(root, template, true);
	    fs.rmSync(libRoot, { recursive: true });
	    config.dependencies.splice(config.dependencies.findIndex(value => value.name == name), 1);
	    writeConfig(cwd, config);
	}
	async function installPackage(fetch, cwd, out) {
	    out("==== INSTALL ====");
	    let yapmConfig = readConfig(cwd);
	    let [resolve, packageConfig] = await installCycle(fetch, cwd, out);
	    let dep = {
	        name: packageConfig.name,
	        version: packageConfig.version,
	        resolve: resolve
	    };
	    if (!dependencyExists(yapmConfig, dep)) {
	        yapmConfig.dependencies.push(dep);
	    }
	    out("Installation finished");
	    writeConfig(cwd, yapmConfig);
	}
	async function installCycle(fetch, cwd, out) {
	    let buff;
	    let url;
	    if (fetch.username == null && fetch.version == null) {
	        buff = await fetchPackageURL(fetch.packageName, out);
	        url = fetch.packageName;
	    }
	    else {
	        let [_, __] = await fetchPackage(fetch.packageName, fetch.username, fetch.version, out);
	        url = _;
	        buff = __;
	    }
	    let zip = new AdmZip(buff);
	    let config = zip.getEntry("yapm.json");
	    if (!config) {
	        throw new FetchError("Error on package file, could not find yapm.json");
	    }
	    let packageYapmConfig = JSON.parse(config.getData().toString("utf-8"));
	    out(`Install package "${packageYapmConfig.name}@${packageYapmConfig.version}"`);
	    saveLib(cwd, zip, packageYapmConfig);
	    for (const value of packageYapmConfig.dependencies) {
	        if (!libIsInstalled(cwd, depToConf(value))) {
	            out(`Install dependency "${value.name}@${value.version}"`);
	            await installCycle({ packageName: value.resolve }, cwd, out);
	        }
	    }
	    return [url, packageYapmConfig];
	}
	async function fetchPackageURL(uri, out) {
	    if (fs.existsSync(uri) && fs.statSync(uri).isFile()) {
	        return fs.readFileSync(uri);
	    }
	    return await fetchURL(uri);
	}
	async function fetchPackage(packageName, username, version, out) {
	    const registers = readRegisterConfig();
	    for (const value of registers) {
	        let url = value.url;
	        url = url.replace(/\{\{package}}/gi, packageName);
	        url = url.replace(/\{\{username}}/gi, username);
	        url = url.replace(/\{\{version}}/gi, version);
	        url = url.replace(/\{\{e-version}}/gi, version.replace(/\./gi, "-"));
	        switch (value.type) {
	            case "GITHUB":
	                out("Fetch Package from " + value.name);
	                if (await urlExists(url)) {
	                    return [url, await fetchURL(url)];
	                }
	            case "GIT":
	                break;
	            case "YAPM-REG":
	                break;
	        }
	    }
	    throw new FetchError("Cannot resolve " + packageName);
	}
	async function urlExists(uri) {
	    return new Promise((resolve) => {
	        let req = http.request({
	            method: "HEAD",
	            host: url.parse(uri).hostname,
	            port: 80,
	            path: url.parse(uri).pathname
	        }, (res) => {
	            res.on("error", (err) => {
	                console.log(err.message);
	            });
	            resolve(res.statusCode.toString()[0] == "3" || res.statusCode.toString()[0] == "2");
	        });
	        req.end();
	    });
	}
	async function fetchURL(uri) {
	    return new Promise((resolve, reject) => {
	        let tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "yapm"));
	        let tmpFile = path.join(tmpDir, "download.tgz");
	        let cmd;
	        if (process.platform == "win32") {
	            cmd = `Powershell.exe -Command "Invoke-RestMethod -Uri ${uri} -OutFile ${tmpFile}"`;
	        }
	        else if (process.platform == "darwin" || process.platform == "linux") {
	            cmd = `curl ${uri} > ${tmpFile}`;
	        }
	        child_process.execSync(cmd, {
	            windowsHide: true
	        });
	        let buff = fs.readFileSync(tmpFile);
	        resolve(buff);
	    });
	}
	function dependencyExists(config, dep) {
	    for (let dependency of config.dependencies) {
	        if (dependency.name == dep.name && dependency.version == dep.version) {
	            return true;
	        }
	    }
	    return false;
	}
	
	__export["1.0.1/yapm/5"] = {};
	__export["1.0.1/yapm/5"].installPackage = installPackage;
	__export["1.0.1/yapm/5"].fetchPackageURL = fetchPackageURL;
	__export["1.0.1/yapm/5"].fetchPackage = fetchPackage;
});
bundler.define("1.0.1/yapm/1", ["1.0.1/yapm/0", "1.0.1/yapm/3"], async (__export, __import) => {
	const checkCWD = __import["1.0.1/yapm/0"].checkCWD;
	const checkLibConfigFormat = __import["1.0.1/yapm/0"].checkLibConfigFormat;
	const checkProjectConfigExists = __import["1.0.1/yapm/0"].checkProjectConfigExists;
	const ProjectInitException = __import["1.0.1/yapm/3"].ProjectInitException;
	const WrongFormatException = __import["1.0.1/yapm/3"].WrongFormatException;
	const fs = require("fs");
	const path = require("path");
	
	
	
	
	function readConfig(cwd) {
	    if (!checkProjectConfigExists(cwd)) {
	        throw new ProjectInitException("Project not initialised");
	    }
	    const content = fs.readFileSync(path.join(cwd, "yapm.json"), "utf-8");
	    if (checkLibConfigFormat(content)) {
	        return JSON.parse(content);
	    }
	    else {
	        throw new WrongFormatException("wrong format in yapm.json");
	    }
	}
	function writeConfig(cwd, config) {
	    checkCWD(cwd);
	    checkProjectConfigExists(cwd);
	    fs.writeFileSync(path.join(cwd, "yapm.json"), JSON.stringify(config, null, 4));
	}
	function getRegisterPath() {
	    const appData = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
	    const base = path.join(appData, "yapm");
	    const config = path.join(base, "register.json");
	    if (!fs.existsSync(base) || !fs.statSync(base).isDirectory()) {
	        fs.mkdirSync(base);
	        fs.writeFileSync(config, JSON.stringify([
	            {
	                type: "GITHUB",
	                name: "github.com",
	                url: "http://github.com/{{username}}/{{package}}/releases/download/{{version}}/{{package}}-{{e-version}}.yapm.tar"
	            }
	        ]));
	    }
	    return config;
	}
	function readRegisterConfig() {
	    const p = getRegisterPath();
	    try {
	        return JSON.parse(fs.readFileSync(p, "utf-8"));
	    }
	    catch (err) {
	        throw new WrongFormatException("Register file has wrong format");
	    }
	}
	function writeRegisterConfig(registers) {
	    const p = getRegisterPath();
	    fs.writeFileSync(p, JSON.stringify(registers));
	}
	
	__export["1.0.1/yapm/1"] = {};
	__export["1.0.1/yapm/1"].readConfig = readConfig;
	__export["1.0.1/yapm/1"].writeConfig = writeConfig;
	__export["1.0.1/yapm/1"].readRegisterConfig = readRegisterConfig;
	__export["1.0.1/yapm/1"].writeRegisterConfig = writeRegisterConfig;
});
bundler.define("1.0.1/yapm/0", ["1.0.1/yapm/4", "1.0.1/yapm/3"], async (__export, __import) => {
	const YAPM_TEMPLATE = __import["1.0.1/yapm/4"].YAPM_TEMPLATE;
	const StructureException = __import["1.0.1/yapm/3"].StructureException;
	const fs = require("fs");
	const path = require("path");
	
	
	
	
	function checkCWD(cwd) {
	    if (!fs.existsSync(cwd) || !fs.statSync(cwd).isDirectory()) {
	        throw new StructureException("Current working directory doesnt exists");
	    }
	}
	function checkLibRoot(cwd, throw_) {
	    checkCWD(cwd);
	    const libRoot = path.join(cwd, "lib");
	    if (!fs.existsSync(libRoot) || !fs.statSync(libRoot).isDirectory()) {
	        if (throw_) {
	            throw new StructureException("Lib collection root folder doesn't exists");
	        }
	        fs.mkdirSync(libRoot);
	    }
	    return libRoot;
	}
	function checkLibData(root, conf, throw_) {
	    if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
	        throw new StructureException("Lib collection root folder doesn't exists");
	    }
	    const libRoot = path.join(root, conf.name);
	    if (!fs.existsSync(libRoot) || !fs.statSync(libRoot).isDirectory()) {
	        if (throw_) {
	            throw new StructureException("Lib folder doesn't exists");
	        }
	        fs.mkdirSync(libRoot);
	    }
	    const versionRoot = path.join(libRoot, conf.version);
	    if (!fs.existsSync(versionRoot) || !fs.statSync(versionRoot).isDirectory()) {
	        if (throw_) {
	            throw new StructureException("Lib version folder doesn't exists");
	        }
	        fs.mkdirSync(versionRoot);
	    }
	    if (fs.readdirSync(versionRoot).length != 0) {
	        fs.rmdirSync(versionRoot, { recursive: true });
	        return checkLibData(root, conf);
	    }
	    return versionRoot;
	}
	function checkLibConfig(libRoot) {
	    if (!fs.existsSync(libRoot) || !fs.statSync(libRoot).isDirectory()) {
	        throw new StructureException("Lib version root folder doesn't exists");
	    }
	    let confFile = path.join(libRoot, "yapm.json");
	    if (!fs.existsSync(confFile) || !fs.statSync(confFile).isFile()) {
	        return false;
	    }
	    return checkLibConfigFormat(fs.readFileSync(confFile, "utf-8"));
	}
	function checkLibConfigFormat(content) {
	    try {
	        let oKeys = Object.keys(JSON.parse(content));
	        for (let key of Object.keys(YAPM_TEMPLATE)) {
	            if (!oKeys.includes(key)) {
	                return false;
	            }
	        }
	    }
	    catch {
	        return false;
	    }
	    return true;
	}
	function saveLib(cwd, buff, conf) {
	    const root = checkLibRoot(cwd);
	    const libRoot = checkLibData(root, conf);
	    buff.extractAllTo(libRoot, true);
	}
	function libIsInstalled(cwd, conf) {
	    try {
	        let root = checkLibRoot(cwd, true);
	        let libRoot = checkLibData(root, conf, true);
	        return checkLibConfig(libRoot);
	    }
	    catch {
	        return false;
	    }
	}
	function checkProjectConfigExists(cwd) {
	    checkCWD(cwd);
	    const configFile = path.join(cwd, "yapm.json");
	    return fs.existsSync(configFile) && fs.statSync(configFile).isFile();
	}
	
	__export["1.0.1/yapm/0"] = {};
	__export["1.0.1/yapm/0"].checkCWD = checkCWD;
	__export["1.0.1/yapm/0"].checkLibRoot = checkLibRoot;
	__export["1.0.1/yapm/0"].checkLibData = checkLibData;
	__export["1.0.1/yapm/0"].checkLibConfig = checkLibConfig;
	__export["1.0.1/yapm/0"].checkLibConfigFormat = checkLibConfigFormat;
	__export["1.0.1/yapm/0"].saveLib = saveLib;
	__export["1.0.1/yapm/0"].libIsInstalled = libIsInstalled;
	__export["1.0.1/yapm/0"].checkProjectConfigExists = checkProjectConfigExists;
});
bundler.define("1.0.1/yapm/6", ["1.0.1/yapm/5"], async (__export, __import) => {
	const fetchPackage = __import["1.0.1/yapm/5"].fetchPackage;
	
	(async () => {
	    console.log("TRY FETCH PACKAGE");
	    let [res, buff] = await fetchPackage("yapm", "Christoph-Koschel", "1.0.1", console.log);
	    console.log(res, buff);
	})().then(() => process.exit(0));
	
	__export["1.0.1/yapm/6"] = {};
});
bundler.define("1.0.1/yapm/4", [], async (__export, __import) => {
	function depToConf(dep) {
	    return {
	        name: dep.name,
	        version: dep.version,
	        author: "<conversion>",
	        license: "<conversion>",
	        dependencies: []
	    };
	}
	const YAPM_TEMPLATE = {
	    name: "",
	    version: "",
	    dependencies: [],
	    license: "",
	    author: ""
	};
	
	__export["1.0.1/yapm/4"] = {};
	__export["1.0.1/yapm/4"].depToConf = depToConf;
	__export["1.0.1/yapm/4"].YAPM_TEMPLATE = YAPM_TEMPLATE;
});
// M:\langs\bun\yapm-cli\build\src\bin\yapm.js
bundler.define("yapm-cli/15", ["1.0.0/fast-cli/3", "1.0.0/fast-cli/0", "1.0.0/fast-cli/1", "1.0.1/yapm/4", "1.0.1/yapm/1", "1.0.1/yapm/2", "1.0.1/yapm/5", "1.0.0/code-database/3", "1.0.0/fast-cli/2"], async (__export, __import) => {
	const CLI = __import["1.0.0/fast-cli/3"].CLI;
	const Command = __import["1.0.0/fast-cli/0"].Command;
	const CommandConstructor = __import["1.0.0/fast-cli/0"].CommandConstructor;
	const readline = __import["1.0.0/fast-cli/1"].readline;
	const YAPM_TEMPLATE = __import["1.0.1/yapm/4"].YAPM_TEMPLATE;
	const readConfig = __import["1.0.1/yapm/1"].readConfig;
	const readRegisterConfig = __import["1.0.1/yapm/1"].readRegisterConfig;
	const writeConfig = __import["1.0.1/yapm/1"].writeConfig;
	const createPackage = __import["1.0.1/yapm/2"].createPackage;
	const installPackage = __import["1.0.1/yapm/5"].installPackage;
	const uninstallPackage = __import["1.0.1/yapm/5"].uninstallPackage;
	const format = __import["1.0.0/code-database/3"].format;
	const output = __import["1.0.0/fast-cli/2"];
	const fs = require("fs");
	const path = require("path");
	
	
	
	
	
	
	
	
	
	
	
	
	const cli = new CLI(process.argv);
	const cwd = process.cwd();
	class Init extends Command {
	    async execute(argv) {
	        console.log("Project name?");
	        const name = await readline();
	        console.log("Version? (1.0.0)");
	        let version = await readline();
	        if (version == "") {
	            version = "1.0.0";
	        }
	        console.log("Author?");
	        const author = await readline();
	        console.log("Version? (MIT)");
	        let license = await readline();
	        if (license == "") {
	            license = "MIT";
	        }
	        const temp = Object.assign({}, YAPM_TEMPLATE);
	        temp.name = name;
	        temp.version = version;
	        temp.license = license;
	        temp.author = author;
	        writeConfig(cwd, temp);
	        return 0;
	    }
	    getCMD() {
	        return new CommandConstructor("init");
	    }
	    getDescription() {
	        return "Init a new yapm file";
	    }
	}
	class Install extends Command {
	    async execute(argv) {
	        let config = readConfig(cwd);
	        if (argv.hasAttr("-p")) {
	            const packageFile = argv.getAttr("-p");
	            const username = argv.hasAttr("-u") ? argv.getAttr("-u") : undefined;
	            const version = argv.hasAttr("-v") ? argv.getAttr("-v") : undefined;
	            await installPackage({
	                packageName: packageFile,
	                username: username,
	                version: version
	            }, cwd, (msg) => output.writeln_log(msg));
	            return 0;
	        }
	        if (fs.existsSync(path.join(cwd, "lib")) && fs.statSync(path.join(cwd, "lib")).isDirectory()) {
	            fs.rmSync(path.join(cwd, "lib"), { recursive: true });
	        }
	        output.writeln_log("Reinstall a packages");
	        for (let dependency of config.dependencies) {
	            await installPackage({
	                packageName: dependency.resolve
	            }, cwd, (msg) => output.writeln_log(msg));
	        }
	        return 0;
	    }
	    getCMD() {
	        return new CommandConstructor("install")
	            .addAttribute("-p", "package", true, "The package for installation")
	            .addAttribute("-u", "user", true, "The username (is for example needed for GitHub)")
	            .addAttribute("-v", "version", true, "The version of the package");
	    }
	    getDescription() {
	        return "Install a package";
	    }
	}
	cli.register(new Install());
	class UnInstall extends Command {
	    async execute(argv) {
	        const name = argv.getAttr("-p");
	        const version = argv.getAttr("-v");
	        const config = readConfig(cwd);
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
	    getCMD() {
	        return new CommandConstructor("uninstall")
	            .addAttribute("-p", "package", false, "The package name for uninstallation")
	            .addAttribute("-v", "version", false, "The package version for uninstallation");
	    }
	    getDescription() {
	        return "Uninstall a package";
	    }
	}
	cli.register(new UnInstall());
	class Pack extends Command {
	    async execute(argv) {
	        createPackage(cwd, output.writeln_log);
	        return 0;
	    }
	    getCMD() {
	        return new CommandConstructor("pack")
	            .addAttribute("-o", "dest", true, "Output of the package");
	    }
	    getDescription() {
	        return "Packs the project to a tar file who can interpret the yapm installer";
	    }
	}
	cli.register(new Init());
	cli.register(new Pack());
	class AddRegisters extends Command {
	    async execute(argv) {
	        return 0;
	    }
	    getCMD() {
	        return new CommandConstructor("register")
	            .addFlag("--add", false, "Add a register")
	            .addAttribute("-n", "name", false, "Name of the register")
	            .addAttribute("-u", "url", false, "The resolve domain template")
	            .addAttribute("-t", "type", false, "The type of the register (GIT|YAPM)");
	    }
	    getDescription() {
	        return "Add register for resolving packages";
	    }
	}
	cli.register(new AddRegisters());
	class ListRegisters extends Command {
	    async execute(argv) {
	        const reg = readRegisterConfig();
	        reg.forEach((value, index, array) => {
	            console.log(format(`(%-${array.length}s) %-8s : %-20s`, index.toString(), value.name, value.url));
	        });
	        return 0;
	    }
	    getCMD() {
	        return new CommandConstructor("register")
	            .addFlag("--list", false, "List the registered registers");
	    }
	    getDescription() {
	        return "";
	    }
	}
	cli.register(new ListRegisters());
	class RemoveRegisters extends Command {
	    async execute(argv) {
	        return 0;
	    }
	    getCMD() {
	        return new CommandConstructor("register")
	            .addFlag("--remove", false, "Removes a register")
	            .addAttribute("-n", "name", false, "Name of the register");
	    }
	    getDescription() {
	        return "Removes a register for resolving packages";
	    }
	}
	cli.register(new RemoveRegisters());
	cli.exec().then((c) => {
	    process.exit(c);
	});
	
	__export["yapm-cli/15"] = {};
});
// M:\langs\bun\yapm-cli\build\src\resources.js
bundler.define("yapm-cli/16", [], async (__export, __import) => {
	const data = new Map();
	function load_resources(id) {
	    if (data.has(id.id)) {
	        return atob(data.get(id.id));
	    }
	    throw "Resources not declared";
	}
	function has_resources(id) {
	    return data.has(id.id);
	}
	const R = {};
	
	__export["yapm-cli/16"] = {};
	__export["yapm-cli/16"].load_resources = load_resources;
	__export["yapm-cli/16"].has_resources = has_resources;
	__export["yapm-cli/16"].R = R;
});
// Entry point call
bundler.load("yapm-cli/15");
bundler.start();