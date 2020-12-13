// Generated by CoffeeScript 2.3.2
(function() {
  /*
   * Omelette Simple Auto Completion for Node
   */
  var EventEmitter, Omelette, depthOf, fs, os, path, removeSubstring,
    hasProp = {}.hasOwnProperty;

  ({EventEmitter} = require("events"));

  path = require("path");

  fs = require("fs");

  os = require("os");

  depthOf = function(object) {
    var depth, key, level;
    level = 1;
    for (key in object) {
      if (!hasProp.call(object, key)) continue;
      if (typeof object[key] === 'object') {
        depth = depthOf(object[key]) + 1;
        level = Math.max(depth, level);
      }
    }
    return level;
  };

  // Removes all occurrences of `needle` from `haystack`
  removeSubstring = function(haystack, needle) {
    return haystack.replace(new RegExp(needle.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'g'), '');
  };

  Omelette = (function() {
    var log;

    class Omelette extends EventEmitter {
      constructor() {
        var isFish, isZsh, ref;
        super();
        this.asyncs = 0;
        this.compgen = process.argv.indexOf("--compgen");
        this.install = process.argv.indexOf("--completion") > -1;
        this.installFish = process.argv.indexOf("--completion-fish") > -1;
        isZsh = process.argv.indexOf("--compzsh") > -1;
        isFish = process.argv.indexOf("--compfish") > -1;
        this.isDebug = process.argv.indexOf("--debug") > -1;
        this.fragment = parseInt(process.argv[this.compgen + 1]) - (isZsh ? 1 : 0);
        this.line = process.argv.slice(this.compgen + 3).join(' ');
        this.word = (ref = this.line) != null ? ref.trim().split(/\s+/).pop() : void 0;
        ({HOME: this.HOME, SHELL: this.SHELL} = process.env);
        this.mainProgram = function() {};
      }

      setProgram(programs) {
        programs = programs.split('|');
        [this.program] = programs;
        return this.programs = programs.map(function(program) {
          return program.replace(/[^A-Za-z0-9\.\_\-]/g, ''); // Do not allow except:
      // .. uppercase
      // .. lowercase
      // .. numbers
      // .. dots
      // .. underscores
      // .. dashes
        });
      }

      setFragments(...fragments1) {
        this.fragments = fragments1;
      }

      generate() {
        var data;
        data = {
          before: this.word,
          fragment: this.fragment,
          line: this.line,
          reply: this.reply
        };
        this.emit("complete", this.fragments[this.fragment - 1], data);
        this.emit(this.fragments[this.fragment - 1], data);
        this.emit(`$${this.fragment}`, data);
        if (this.asyncs === 0) {
          return process.exit();
        }
      }

      reply(words = []) {
        var writer;
        writer = function(options) {
          console.log(typeof options.join === "function" ? options.join(os.EOL) : void 0);
          return process.exit();
        };
        if (words instanceof Promise) {
          return words.then(writer);
        } else {
          return writer(words);
        }
      }

      next(handler) {
        if (typeof handler === 'function') {
          return this.mainProgram = handler;
        }
      }

      tree(objectTree = {}) {
        var depth, i, level, ref;
        depth = depthOf(objectTree);
        for (level = i = 1, ref = depth; (1 <= ref ? i <= ref : i >= ref); level = 1 <= ref ? ++i : --i) {
          this.on(`$${level}`, function({fragment, reply, line}) {
            var accessor, lastIndex, replies;
            if (!(/\s+/.test(line.slice(-1)))) {
              lastIndex = -1;
            }
            accessor = t => line.split(/\s+/).slice(1, lastIndex).filter(Boolean).reduce((a, v) => a[v], t);
            replies = fragment === 1 ? Object.keys(objectTree) : accessor(objectTree);
            return reply((function(replies) {
              if (replies instanceof Function) {
                return replies();
              }
              if (replies instanceof Array) {
                return replies;
              }
              if (replies instanceof Object) {
                return Object.keys(replies);
              }
            })(replies));
          });
        }
        return this;
      }

      generateCompletionCode() {
        var completions;
        completions = this.programs.map((program) => {
          var completion;
          completion = `_${program}_completion`;
          return `### ${program} completion - begin. generated by omelette.js ###\nif type compdef &>/dev/null; then\n  ${completion}() {\n    compadd -- \`${this.program} --compzsh --compgen "\${CURRENT}" "\${words[CURRENT-1]}" "\${BUFFER}"\`\n  }\n  compdef ${completion} ${program}\nelif type complete &>/dev/null; then\n  ${completion}() {\n    local cur prev nb_colon\n    _get_comp_words_by_ref -n : cur prev\n    nb_colon=$(grep -o ":" <<< "$COMP_LINE" | wc -l)\n\n    COMPREPLY=( $(compgen -W '$(${this.program} --compbash --compgen "$((COMP_CWORD - (nb_colon * 2)))" "$prev" "\${COMP_LINE}")' -- "$cur") )\n\n    __ltrim_colon_completions "$cur"\n  }\n  complete -F ${completion} ${program}\nfi\n### ${program} completion - end ###`;
        });
        if (this.isDebug) {
          // Adding aliases for testing purposes
          completions.push(this.generateTestAliases());
        }
        return completions.join(os.EOL);
      }

      generateCompletionCodeFish() {
        var completions;
        completions = this.programs.map((program) => {
          var completion;
          completion = `_${program}_completion`;
          return `### ${program} completion - begin. generated by omelette.js ###\nfunction ${completion}\n  ${this.program} --compfish --compgen (count (commandline -poc)) (commandline -pt) (commandline -pb)\nend\ncomplete -f -c ${program} -a '(${completion})'\n### ${program} completion - end ###`;
        });
        if (this.isDebug) {
          // Adding aliases for testing purposes
          completions.push(this.generateTestAliases());
        }
        return completions.join(os.EOL);
      }

      generateTestAliases() {
        var debugAliases, debugUnaliases, fullPath;
        fullPath = path.join(process.cwd(), this.program);
        debugAliases = this.programs.map(function(program) {
          return `  alias ${program}=${fullPath}`;
        }).join(os.EOL);
        debugUnaliases = this.programs.map(function(program) {
          return `  unalias ${program}`;
        }).join(os.EOL);
        return `### test method ###\nomelette-debug-${this.program}() {\n${debugAliases}\n}\nomelette-nodebug-${this.program}() {\n${debugUnaliases}\n}\n### tests ###`;
      }

      checkInstall() {
        if (this.install) {
          log(this.generateCompletionCode());
          process.exit();
        }
        if (this.installFish) {
          log(this.generateCompletionCodeFish());
          return process.exit();
        }
      }

      getActiveShell() {
        if (!this.SHELL) {
          throw new Error('Shell could not be detected');
        }
        if (this.SHELL.match(/bash/)) {
          return 'bash';
        } else if (this.SHELL.match(/zsh/)) {
          return 'zsh';
        } else if (this.SHELL.match(/fish/)) {
          return 'fish';
        } else {
          throw new Error(`Unsupported shell: ${this.SHELL}`);
        }
      }

      getDefaultShellInitFile() {
        var fileAt, fileAtHome;
        fileAt = function(root) {
          return function(file) {
            return path.join(root, file);
          };
        };
        fileAtHome = fileAt(this.HOME);
        switch (this.shell = this.getActiveShell()) {
          case 'bash':
            return fileAtHome('.bash_profile');
          case 'zsh':
            return fileAtHome('.zshrc');
          case 'fish':
            return fileAtHome('.config/fish/config.fish');
        }
      }

      getCompletionBlock() {
        var command, completionPath;
        command = (function() {
          switch (this.shell) {
            case 'bash':
              completionPath = path.join(this.HOME, `.${this.program}`, 'completion.sh');
              return `source ${completionPath}`;
            case 'zsh':
              return `. <(${this.program} --completion)`;
            case 'fish':
              return `${this.program} --completion-fish | source`;
          }
        }).call(this);
        if (command) {
          return `\n# begin ${this.program} completion\n${command}\n# end ${this.program} completion\n`;
        }
      }

      setupShellInitFile(initFile = this.getDefaultShellInitFile()) {
        var completionPath, programFolder;
        // @shell might be undefined if an `initFile` was passed
        if (this.shell == null) {
          this.shell = this.getActiveShell();
        }
        // Special treatment for bash to handle extra folder
        if (this.shell === 'bash') {
          programFolder = path.join(this.HOME, `.${this.program}`);
          completionPath = path.join(programFolder, 'completion.sh');
          if (!fs.existsSync(programFolder)) {
            fs.mkdirSync(programFolder);
          }
          fs.writeFileSync(completionPath, this.generateCompletionCode());
        }
        // For every shell, write completion block to the init file
        fs.appendFileSync(initFile, this.getCompletionBlock());
        return process.exit();
      }

      cleanupShellInitFile(initFile = this.getDefaultShellInitFile()) {
        var cleanedInitFile, completionPath, programFolder;
        // @shell might be undefined if an `initFile` was passed
        if (this.shell == null) {
          this.shell = this.getActiveShell();
        }
        // For every shell, rewrite the init file
        if (fs.existsSync(initFile)) {
          cleanedInitFile = removeSubstring(fs.readFileSync(initFile, 'utf8'), this.getCompletionBlock());
          fs.writeFileSync(initFile, cleanedInitFile);
        }
        // Special treatment for bash to handle extra folder
        if (this.shell === 'bash') {
          programFolder = path.join(this.HOME, `.${this.program}`);
          completionPath = path.join(programFolder, 'completion.sh');
          if (fs.existsSync(completionPath)) {
            fs.unlinkSync(completionPath);
          }
          if ((fs.existsSync(programFolder)) && (fs.readdirSync(programFolder)).length === 0) {
            fs.rmdirSync(programFolder);
          }
        }
        return process.exit();
      }

      init() {
        if (this.compgen > -1) {
          return this.generate();
        } else {
          return this.mainProgram();
        }
      }

      onAsync(event, handler) {
        super.on(event, handler);
        return this.asyncs += 1;
      }

    };

    ({log} = console);

    return Omelette;

  }).call(this);

  module.exports = function(template, ...args) {
    var _omelette, callback, callbacks, fragment, fragments, i, index, len, program;
    if (template instanceof Array && args.length > 0) {
      [program, callbacks] = [template[0].trim(), args];
      fragments = callbacks.map(function(callback, index) {
        return `arg${index}`;
      });
    } else {
      [program, ...fragments] = template.split(/\s+/);
      callbacks = [];
    }
    fragments = fragments.map(function(fragment) {
      return fragment.replace(/^\<+|\>+$/g, '');
    });
    _omelette = new Omelette;
    _omelette.setProgram(program);
    _omelette.setFragments(...fragments);
    _omelette.checkInstall();
    for (index = i = 0, len = callbacks.length; i < len; index = ++i) {
      callback = callbacks[index];
      fragment = `arg${index}`;
      (function(callback) {
        return _omelette.on(fragment, function(...args) {
          return this.reply(callback instanceof Array ? callback : callback(...args));
        });
      })(callback);
    }
    return _omelette;
  };

}).call(this);
