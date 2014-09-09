/lex
%left ASTERIX
%left PLUS
%left DOT
%left RNGICL
%left RNGECL
%start top-level-block

%%

top-level-block
    : statements EOF { $$ = new TopLevelBlock($1); return $$ }
    ;

block
    : LCBRAC NL statements RCBRAC NL { $$ = new Block($3); }
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
    : RETURN           { $$ = new ReturnStatement(); }
    | RETURN expr      { $$ = new ReturnStatement($2); }
    ;

for-in-stat
    : FOR id IN expression block  { $$ = new ForInLoop($4, $2, $5 ); }
    ;

declaration
    : let-declaration
    | function-declaration
    ;

function-declaration
    : FUNC id LBRAC parameters RBRAC ARROW id block  { $$ = new FunctionDeclaration($2, $4, $8, $7) }
    | FUNC id LBRAC parameters RBRAC block              { $$ = new FunctionDeclaration($2, $4, $6) }
    ;

parameters
    : parameter { $$ = [$1] }
    | parameters COMMA parameter { $$ = $1; $$.push(parameter); }
    ;

parameter
    : id COL id  { $$ = new Parameter($1, $3) }
    ;

let-declaration
    : LET id ASSIGN expression  { $$ = new ConstantDeclaration($2, $4) }
    | LET id COL type-adnotation ASSIGN expression { $$ = new ConstantDeclaration($2, $6, $4) }
    ;

type-adnotation
    : id
    ;

stat-end
    : NL
    | SEM
    |
    ;

id
    : IDENT                       { $$ = new Id($1) }
    ;

expression
    : NUMBER                      { $$ = new IntegerNumberLiteral($1) }
    | FLOAT_NUMBER                { $$ = new DoubleNumberLiteral($1) }
    | id
    | expression-binary-operator
    | array
    | function-call
    ;

expression-binary-operator
    : expression PLUS expression    { $$ = new OperatorCall($2, $1, $3) }
    | expression ASTERIX expression { $$ = new OperatorCall($2, $1, $3) }
    | expression DOT expression     { $$ = new OperatorCall($2, $1, $3) }
    | expression RNGICL expression  { $$ = new OperatorCall($2, $1, $3) }
    | expression RNGECL expression  { $$ = new OperatorCall($2, $1, $3) }
    ;

function-call
    : id LBRAC RBRAC                      { $$ = new FunctionCall($1, []) }}
    | id LBRAC comma-separated-expression RBRAC { $$ = new FunctionCall($1, $3) }}
    ;

comma-separated-expression
    : expression                       { $$ = [$1] }
    | comma-separated-expression COMMA
    | comma-separated-expression expression  { $$ = $1; $$.push($2) }
    ;

array
    : LSBRAC comma-separated-expression RSBRAC     { $$ = new Arrayexpressionession($2); }
    ;