import * as ts from 'typescript';
import * as path from 'path';
import * as chalk from 'chalk';

export function compileProject(project: string, options: ts.CompilerOptions) {
  let parsed = parseProjectConfig(project, options);
  let program = ts.createProgram(parsed.fileNames, parsed.options);
  let baseDir = program.getCurrentDirectory();

  reportDiagnostics(program.getOptionsDiagnostics(), baseDir);
  reportDiagnostics(program.emit().diagnostics, baseDir);
}

function parseProjectConfig(project: string, options: ts.CompilerOptions) {
  let config = ts.readConfigFile(project, ts.sys.readFile).config;
  let basePath = path.dirname(project);

  let host = {
    useCaseSensitiveFileNames: true,
    fileExists: ts.sys.fileExists,
    readDirectory: ts.sys.readDirectory,
    readFile: ts.sys.readFile
  };

  return ts.parseJsonConfigFileContent(config, host, basePath, options);
}

export function formatDiagnostics(diagnostics: ts.Diagnostic[], baseDir: string): string {
  return diagnostics.map(diagnostic => {
    let res = `• ${chalk.red(`TS${diagnostic.code}`)} - `;

    if (diagnostic.file) {
      let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
      let filePath = path.relative(baseDir, diagnostic.file.fileName);

      res += `${filePath}(${line + 1},${character + 1}): `;
    }
    res += `${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`;

    return res;
  }).join('\n');
}

export function reportDiagnostics(diagnostics: ts.Diagnostic[], baseDir?: string) {
  if (diagnostics && diagnostics.length && diagnostics[0]) {
    console.error(formatDiagnostics(diagnostics, baseDir));
    throw new Error('TypeScript compilation failed.');
  }
}
