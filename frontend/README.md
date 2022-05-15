# Generate new UI components

To generate new component you can use generate-react-cli tool

# How to use?

> Create new component -> ./src/components/${componentName}/*
```
npx generate-react-cli component ${componentName}
```

> Create new Base component -> ./src/base/${componentName}/*
```
npx generate-react-cli component ${componentName} --type=base
```

> Check the potential structure after generation
```
npx generate-react-cli component ${componentName} --dry-run
```

Thanks for the tool! Visit for more details - https://github.com/arminbro/generate-react-cli