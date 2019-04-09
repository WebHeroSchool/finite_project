# Workflow for building web application

* [Handelbars](http://handlebarsjs.com/) 
* [PostCSS](https://github.com/postcss/postcss)
    * [Assets](https://github.com/assetsjs/postcss-assets)
    * [Nested](https://github.com/postcss/postcss-nested)
    * [Sorting](https://github.com/hudochenkov/postcss-sorting)
    * [Short](https://github.com/jonathantneal/postcss-short)
    * [StyleLint](https://www.npmjs.com/package/stylelint)
    * [Reporter](https://github.com/postcss/postcss-reporter)
    * [Autoprefixer](https://github.com/postcss/autoprefixer)
* [ESLint](http://eslint.org/)
* [Gulp](http://gulpjs.com/)
* The modular build
* [Browser-sync](https://www.browsersync.io/)

## Global dependencies
You must have installed: `node`, `npm`, `gulp`.

##How to work with this project

1. `git clone https://github.com/WebHeroSchool/build.git app`
2. `cd build`
3. `npm i`
4. `gulp` 
... or
`NODE_ENV=production gulp`
(for production version)

---


## Project structure

* `src/` 
    - `fonts/` 
    - `styles/` default and font styles
    - `templates/`
      - `template/`
        - `images/` files using template (svg, png)
        - `template.css` template styles
        - `template.hbs` template
        - `template.js` template script
      - `index.css` entry-point styles (template)
      - `index.hbs` entry-point (template)
      - `index.js` entry-point scripts (template)
      - `test.json` handlebars context
* `build/` build directory 
* `config.js` configuration file 
* `eslintrc.json` eslint rules
* `stylelintrc.json` stylilint rules
