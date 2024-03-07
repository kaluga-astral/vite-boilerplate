const path = require('path');

const { Project, SyntaxKind } = require('ts-morph');

// TODO: adjust the path to tsconfig
const project = new Project({
  tsConfigFilePath: './tsconfig.json',
  skipAddingFilesFromTsConfig: true,
});

// TODO: adjust the paths to modules and screens
project.addSourceFilesAtPaths('modules/**/features/**/*.ts');
project.addSourceFilesAtPaths('modules/**/features/**/*.tsx');
project.addSourceFilesAtPaths('screens/**/*.ts');
project.addSourceFilesAtPaths('screens/**/*.tsx');

// Function to determine if a class is a MobX store
function isMobXStore(classDeclaration) {
  const constructor = classDeclaration.getConstructors()[0];

  if (constructor) {
    // Check if `makeAutoObservable` has in the constructor
    const calls = constructor.getDescendantsOfKind(SyntaxKind.CallExpression);

    return calls.some((call) => {
      const expression = call.getExpression();

      return expression.getText() === 'makeAutoObservable';
    });
  }

  return false;
}

function isStoreCreatorFunction(functionDeclaration) {
  return (
    functionDeclaration.getName().startsWith('create') &&
    functionDeclaration.getName().endsWith('Store')
  );
}

project.getSourceFiles().forEach((sourceFile) => {
  const oldFilePath = sourceFile.getFilePath();
  const directoryPath = path.dirname(oldFilePath);
  const parentDirectory = path.dirname(directoryPath);
  const newDirectoryPath = path.join(parentDirectory, 'UIStore');
  const baseName = path.basename(oldFilePath, '.ts');

  // skip files that not in ./store folder or that is components
  if (!directoryPath.endsWith('store') || oldFilePath.endsWith('.tsx')) {
    return;
  }

  // Handle index.ts file
  if (baseName === 'index') {
    const newIndexFilePath = path.join(newDirectoryPath, 'index.ts');

    sourceFile.move(newIndexFilePath);
    console.log(`Moved ${oldFilePath} to ${newIndexFilePath}`);

    return;
  }

  // Handle store file
  const classes = sourceFile.getClasses();

  classes.forEach((classDeclaration) => {
    if (isMobXStore(classDeclaration)) {
      // Rename class
      console.log(`Rename ${classDeclaration.getName()} to UIStore`);
      classDeclaration.rename('UIStore');

      // Rename store creation functions
      sourceFile.getVariableDeclarations().forEach((variableDeclaration) => {
        if (isStoreCreatorFunction(variableDeclaration)) {
          console.log(
            `Rename ${variableDeclaration.getName()} to createUIStore`,
          );

          variableDeclaration.rename('createUIStore');
        }
      });

      // Rename file and folder
      const newFilePath = path.join(parentDirectory, 'UIStore', 'UIStore.ts');

      sourceFile.move(newFilePath);
      console.log(`Moved ${oldFilePath} to ${newFilePath}`);

      return;
    }
  });

  // test files
  if (baseName.endsWith('.test')) {
    const newBaseName = baseName.replace('store', 'UIStore');
    const newFilePath = path.join(newDirectoryPath, `${newBaseName}.ts`);

    console.log(`Move ${oldFilePath} to ${newFilePath}`);
    sourceFile.move(newFilePath);
  }
});

// Save changes
project.saveSync();
