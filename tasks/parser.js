function parseToAst(source) {
    return require("acorn").parse(source, {ecmaVersion: 2020});
}

function isGlobalVariable(name) {
    return !!(name in global);
}

function extractVariables(ast) {
    let subs = [];
    let bound = {};
    let free = [];
    switch (ast.type) {
        case 'Program':
        case 'BlockStatement':
        case 'ObjectExpression':
            subs = ast.body || ast.properties;
            break;
        case 'ExpressionStatement':
        case 'UpdateExpression':
        case 'MemberExpression':
        case 'UnaryExpression':
        case 'LabeledStatement':
        case 'Property':
            subs = [ast.expression || ast.argument || ast.object || ast.body || ast.value];
            break;
        case 'CallExpression':
            subs = [ast.callee].concat(ast.arguments);
            break;
        case 'AssignmentExpression':
        case 'BinaryExpression':
        case 'LogicalExpression':
            subs = [ast.left, ast.right];
            break;
        case 'ConditionalExpression':
            subs = [ast.test, ast.consequent, ast.alternate];
            break;
        case 'Identifier':
            if (!isGlobalVariable(ast.name))
                free.push({start: ast.start, end: ast.end, name: ast.name});
            break;
        case 'VariableDeclaration':
            subs = ast.declarations;
            break;
        case 'VariableDeclarator':
            let ext = extractVariables(ast.init);
            free = ext.free;
            bound[ast.id.name] = true;
            break;
        case 'ForStatement':
            subs = [ast.init, ast.test, ast.update, ast.body];
            break;
        case 'Literal':
            break;
        default:
            console.log("Unexpected", ast);
    }
    subs.forEach(child => {
        let ext = extractVariables(child);
        free = free.concat(ext.free.filter(v => !bound[v.name]));
        for (let n in ext.bound) bound[n] = true;
    });
    return {free: free, bound: bound};
}

function scopeFreeVariables(source, freeVariables, scope) {
    freeVariables.reverse().forEach(v => {
        source = source.substring(0, v.start) + scope + "." + source.substring(v.start);
    });
    return source;
}

function scopeSource(source, scope) {
    return scopeFreeVariables(source, extractVariables(parseToAst(source)).free, scope);
}

module.exports = {
    parseToAst: parseToAst,
    extractVariables: extractVariables,
    scopeFreeVariables: scopeFreeVariables,
    scopeSource: scopeSource
};
