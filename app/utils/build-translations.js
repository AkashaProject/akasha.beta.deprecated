import { parse } from 'intl-messageformat-parser';
import * as fs from 'fs';
import { sync as globSync } from 'glob';
import { sync as mkdirpSync } from 'mkdirp';

const MESSAGES_PATTERN = './intl/app/**/*.json';
const LANG_DIR = './app/locale-data/';

const ESCAPED_CHARS = {
    '\\': '\\\\',
    '\\#': '\\#',
    '{': '\\{',
    '}': '\\}',
};

const ESCAPE_CHARS_REGEXP = /\\#|[{}\\]/g;

export default function printICUMessage (ast) {
    return ast.elements.reduce((message, el) => { // eslint-disable-line complexity
        const { format, id, type, value } = el;

        if (type === 'messageTextElement') {
            return message + value.replace(ESCAPE_CHARS_REGEXP, char =>
                ESCAPED_CHARS[char]
            );
        }

        if (!format) {
            return `${message}{${id}}`;
        }

        const formatType = format.type.replace(/Format$/, '');

        let style;
        let offset;
        let options;

        switch (formatType) {
            case 'number':
            case 'date':
            case 'time':
                style = format.style ? `, ${format.style}` : '';
                return `${message}{${id}, ${formatType}${style}}`;

            case 'plural':
            case 'selectOrdinal':
            case 'select':
                offset = format.offset ? `, offset:${format.offset}` : '';
                options = format.options.reduce((str, option) => {
                    const optionValue = printICUMessage(option.value);
                    return `${str} ${option.selector} {${optionValue}}`;
                }, '');
                return `${message}{${id}, ${formatType}${offset},${options}}`;
            default: return {};
        }
    }, '');
}

class Translator {
    constructor (translateText) {
        this.translateText = translateText;
    }

    translate (message) {
        const ast = parse(message);
        const translated = this.transform(ast);
        return print(translated);
    }

    transform (ast) {
        ast.elements.forEach((el) => {
            if (el.type === 'messageTextElement') {
                el.value = this.translateText(el.value);
            } else {
                const options = el.format && el.format.options;
                if (options) {
                    options.forEach(option => this.transform(option.value));
                }
            }
        });

        return ast;
    }
}

const defaultMessages = globSync(MESSAGES_PATTERN)
    .map(filename => fs.readFileSync(filename, 'utf8'))
    .map(file => JSON.parse(file))
    .reduce((collection, descriptors) => {
        descriptors.forEach(({ id, defaultMessage }) => {
            if (Object.prototype.hasOwnProperty.call(collection, id)) {
                throw new Error(`Duplicate message id: ${id}`);
            }

            collection[id] = defaultMessage;
        });

        return collection;
    }, {});

mkdirpSync(LANG_DIR);
fs.writeFileSync(`${LANG_DIR}en-source.json`, JSON.stringify(defaultMessages, null, 2));
fs.writeFileSync(`${LANG_DIR}en.json`, JSON.stringify(defaultMessages, null, 2));
