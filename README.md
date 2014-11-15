SwiftAST
===========
[![Build Status](https://travis-ci.org/krzKaczor/SwiftAST.svg)](https://travis-ci.org/krzKaczor/SwiftAST)

SwiftAST is [Abstract Syntax Tree](http://en.wikipedia.org/wiki/Abstract_syntax_tree) builder and type analyzer of Swift language written in JavaScript.

This is experimental project under heavy development.

### Feature list 
For now browse tests to see what it can do.

### Sample output
Here is sample AST for fibonacci's sequence swift implementation:

    func fib (n : Int) -> Int {
        if n == 0 {
            return 0;
        }

        if n == 1 {
            return 1;
        }

        return fib(n-1) + fib(n-2);
    }

    let resultFor7 = fib(7);

Output:

    { CLASS: 'TopLevelBlock',
      statements:
       [ { CLASS: 'FunctionDeclaration',
           name: 'fib',
           parameters:
            [ { CLASS: 'Parameter',
                name: 'n',
                typeDeclared: { CLASS: 'NamedTypeNode', name: 'Int', type: Int },
                externalName: undefined,
                type: Int } ],
           block:
            { CLASS: 'Block',
              statements:
               [ { condition:
                    { CLASS: 'LogicalOperatorCall',
                      operator: '==',
                      left:
                       { CLASS: 'Id',
                         value: 'n',
                         symbol:
                          { CLASS: 'ConstantTypeSymbol',
                            name: 'n',
                            type: Int,
                            cannotOverwrite: true },
                         type: Int },
                      right: { CLASS: 'IntLiteral', value: 0, symbol: undefined, type: Int },
                      type: Bool },
                   block:
                    { CLASS: 'Block',
                      statements:
                       [ { CLASS: 'ReturnStatement',
                           expression: { CLASS: 'IntLiteral', value: 0, symbol: undefined, type: Int },
                           type: Int } ] } },
                 { condition:
                    { CLASS: 'LogicalOperatorCall',
                      operator: '==',
                      left:
                       { CLASS: 'Id',
                         value: 'n',
                         symbol:
                          { CLASS: 'ConstantTypeSymbol',
                            name: 'n',
                            type: Int,
                            cannotOverwrite: true },
                         type: Int },
                      right: { CLASS: 'IntLiteral', value: 1, symbol: undefined, type: Int },
                      type: Bool },
                   block:
                    { CLASS: 'Block',
                      statements:
                       [ { CLASS: 'ReturnStatement',
                           expression: { CLASS: 'IntLiteral', value: 1, symbol: undefined, type: Int },
                           type: Int } ] } },
                 { CLASS: 'ReturnStatement',
                   expression:
                    { CLASS: 'OperatorCall',
                      operator: '+',
                      left:
                       { CLASS: 'FunctionCall',
                         callee: 'fib',
                         args:
                          { CLASS: 'ParenthesizedExpression',
                            expressions:
                             [ { CLASS: 'OperatorCall',
                                 operator: '-',
                                 left:
                                  { CLASS: 'Id',
                                    value: 'n',
                                    symbol:
                                     { CLASS: 'ConstantTypeSymbol',
                                       name: 'n',
                                       type: Int,
                                       cannotOverwrite: true },
                                    type: Int },
                                 right: { CLASS: 'IntLiteral', value: 1, symbol: undefined, type: Int },
                                 type: Int } ],
                            ids: [ undefined ],
                            expressionsTypes: [ Int ],
                            type: (Int) },
                         functionType: Function (Int) -> Int,
                         type: Int },
                      right:
                       { CLASS: 'FunctionCall',
                         callee: 'fib',
                         args:
                          { CLASS: 'ParenthesizedExpression',
                            expressions:
                             [ { CLASS: 'OperatorCall',
                                 operator: '-',
                                 left:
                                  { CLASS: 'Id',
                                    value: 'n',
                                    symbol:
                                     { CLASS: 'ConstantTypeSymbol',
                                       name: 'n',
                                       type: Int,
                                       cannotOverwrite: true },
                                    type: Int },
                                 right: { CLASS: 'IntLiteral', value: 2, symbol: undefined, type: Int },
                                 type: Int } ],
                            ids: [ undefined ],
                            expressionsTypes: [ Int ],
                            type: (Int) },
                         functionType: Function (Int) -> Int,
                         type: Int },
                      type: Int },
                   type: Int } ] },
           returnTypeDeclaredBare: { CLASS: 'NamedTypeNode', name: 'Int', type: Int },
           paramsTypes: (Int),
           returnType: Int },
         { CLASS: 'ConstantDeclaration',
           pattern:
            { CLASS: 'IdentifierPattern',
              name: 'resultFor7',
              typeBare: undefined,
              type: Int },
           expression:
            { CLASS: 'FunctionCall',
              callee: 'fib',
              args:
               { CLASS: 'ParenthesizedExpression',
                 expressions: [ { CLASS: 'IntLiteral', value: 7, symbol: undefined, type: Int } ],
                 ids: [ undefined ],
                 expressionsTypes: [ Int ],
                 type: (Int) },
              functionType: Function (Int) -> Int,
              type: Int },
           type: Int } ] }

### License
MIT