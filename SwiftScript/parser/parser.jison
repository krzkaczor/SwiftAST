/lex
%right ARROW
%left ASTERIX
%left PLUS
%left DOT
%left RNGICL
%left RNGECL
%start top-level-block

%%

top-level-block
    : statements EOF { $$ = new TopLevelBlock($1); return $$ }
    | EOF            { $$ = new TopLevelBlock([]); return $$ }
    ;

block
    : LCBRAC NL statements RCBRAC { $$ = new Block($3); }
    ;

statements
    : statements statement { $$ = $1; $$.push($2); }
    | statement { $$ = [$1]; }
    ;

statement
    : declaration stat-end
    | for-in-stat
    | expression stat-end
    | return stat-end
    ;

return
    : RETURN expression      { $$ = new ReturnStatement($2); }
    | RETURN                 { $$ = new ReturnStatement(); }
    ;

for-in-stat
    : FOR id IN expression block  { $$ = new ForInLoop($4, $2, $5 ); }
    ;

declaration
    : let-declaration
    | function-declaration
    ;

function-declaration
    : FUNC id LBRAC parameters RBRAC ARROW type block  { $$ = new FunctionDeclaration($2, $4, $8, $7) }
    | FUNC id LBRAC parameters RBRAC block           { $$ = new FunctionDeclaration($2, $4, $6) }
    ;

parameters
    : { $$ = [] }
    | parameters-list
    ;

parameters-list
    : parameter { $$ = [$1] }
    | parameters COMMA parameter { $$ = $1; $$.push(parameter); }
    ;

parameter
    : id type-annotation  { $$ = new Parameter($1, $2) }
    ;

let-declaration
    : LET pattern ASSIGN expression  { $$ = new ConstantDeclaration($2, $4) }
    ;

pattern
    : id type-annotation    { $$ = new IdentifierPattern($1, $2); }
    | id                    { $$ = new IdentifierPattern($1); }
    | tuple-pattern
    ;

tuple-pattern
    : LBRAC tuple-pattern-elements RBRAC        { $$ = $2 }
    ;

tuple-pattern-elements
    : pattern                                   { $$ = new TuplePattern($1) }
    | tuple-pattern-elements COMMA pattern      { $$ = $1; $$.add($3) }
    ;

type-annotation
    : COL type              { $$ = $2 }
    ;

type
    : id                                 { $$ = new NamedTypeNode($1) }
    | type ARROW type                    { $$ = new FunctionTypeNode($1, $3) }
    | LBRAC comma-separated-type RBRAC   { $$ = new TupleTypeNode($2) }
    ;

comma-separated-type
    :                                                    { $$ = []; }
    | type-or-name-and-type                              { $$ = [$1]; }
    | comma-separated-type COMMA type-or-name-and-type   { $$ = $1; $1.push($3) }
    ;

type-or-name-and-type
    : id COL type                              { $$ = $3; $$.id = $1 }
    | type                                     { $$ = $1; }
    ;

stat-end
    : NL
    | SEM
    ;

id
    : IDENT                     { $$ = new Id($1) }
    ;

number
    : NUMBER                    { $$ = new IntegerNumberLiteral($1) }
    ;

float-number
    : FLOAT_NUMBER              { $$ = new DoubleNumberLiteral($1) }
    ;

string
    : STRING                    { $$ = new StringLiteral($1) }
    ;

expression
    : value-expression
    | expression-binary-operator
    | array
    | function-call
    | parenthesized-expression
    ;

value-expression
    : number
    | float-number
    | id
    | string
    ;

parenthesized-expression
    : LBRAC comma-separated-expression RBRAC { $$ = new ParenthesizedExpression($2) }
    ;

expression-binary-operator
    : expression PLUS expression          { $$ = new OperatorCall($2, $1, $3) }
    | expression ASTERIX expression       { $$ = new OperatorCall($2, $1, $3) }
    | expression DOT value-expression     { $$ = new MemberAccess($1, $3) }
    | expression RNGICL expression        { $$ = new OperatorCall($2, $1, $3) }
    | expression RNGECL expression        { $$ = new OperatorCall($2, $1, $3) }
    ;

function-call
    : id parenthesized-expression { $$ = new FunctionCall($1, $2) }
    ;

comma-separated-expression
    : expression                       { $$ = [$1] }
    | comma-separated-expression COMMA expression { $$ = $1; $$.push($3) }
    ;