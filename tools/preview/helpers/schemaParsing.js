import globals from '../schemas/global.schema.json';
import { isObject, titleCase } from './utilities.js';

const getDefaultValue = (schema) => { //{ default: defaultValue, examples, type }) => {
    if (schema.default) return schema.default;
    
    if (schema.examples && schema.examples.length > 0) return schema.examples[0];

    // Use type to set an empty/null default value
    if (schema.type === 'boolean') return false;
    if (schema.type === 'string') return '';
    if (schema.type === 'number' || schema.type === 'integer') return 0;
    if (schema.type === 'array') return [];
    if (isObject(schema.type)) return {};
    return;
};

const argControlTypes = ({ format, type, minimum, maximum, enum: options, $ref }, isRequired) => {
    if (type === 'boolean') return { control: 'boolean' };
    if (type === 'number' || type === 'integer') {
        if (typeof minimum === 'number' && typeof maximum === 'number') return {
            control: {
                type: 'range',
                min: minimum,
                max: maximum,
            }
        };

        return { control: 'number' };
    }
    if (type === 'object' || type === 'array') return { control: 'object' };
    if (options && options.length > 0) return {
        options: [
            ...options, // .map((option) => titleCase(option)),
        ],
        control: format === 'radio' ? 'inline-radio' : 'select',
    };
    if (!type && $ref && $ref.endsWith('icon')) {
        return argControlTypes(globals.properties.icon, isRequired);
    }

    return {
        control: {
            type: format ?? 'text',
        },
    };
};

export const getArgsFromSchema = (inputSchema) => {
    const { title, description, $id, properties, required } = inputSchema;
    const { pseudos, actions, ...props } = properties;
    const meta = {
        title: title ?? $id.replace(/^#/, '').replace(/([a-z])([A-Z])/, '$1 $2'),
        description,
        component: $id.replace(/^#/, ''),
    };

    const argTypes = {};
    const args = {};
    for (const [key, schema] of Object.entries(props)) {
        if (!schema) continue;

        const isRequired = required?.includes(key);

        args[key] = isRequired ? getDefaultValue(schema) : undefined;

        const { title, description, type, category } = schema;

        argTypes[key] = {
            name: title ?? key ? `${titleCase(key)}` : '',
            type: {
                name: type,
                required: isRequired,
            },
            defaultValue: args[key],
            description,
            table: {
                type: { summary: type },
                disable: schema.const || schema.readonly || schema.hidden,
                category: category ?? 'Component',
                defaultValue: { summary: args[key] },
            },
            ...argControlTypes(schema, isRequired),
        };
    }


    const retActions = {
        handles: [],
        pseudo: {},
    };
    if (actions) {
        const arr = getDefaultValue(actions);
        for (const a of arr) {
            retActions.handles.push(`${a.type}${a.selector ? ` ${a.selector}` : ''}`);
            if (a.pseudo) retActions.pseudo[a.pseudo] = a.selector ?? true;
        }
    }

    return { meta, argTypes, args, retActions };
};