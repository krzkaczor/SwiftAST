/lex
%right ARROW
%right ASSIGN
%right DOUBLE_ASSIGN
%left ASTERIX
%left DIV
%left PLUS
%left MINUS
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
    : LCBRAC statements RCBRAC stat-end { $$ = new Block($2); }
    ;

statements
    : statements statement { $$ = $1; $$.push($2); }
    | statement { $$ = [$1]; }
    ;

statement
    : declaration
    | for-in-stat
    | expression stat-end
    | return stat-end
    | if-stat
    ;

if-stat
    : IF expression block    { $$ = new IfStatement($2, $3); }
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
    | var-declaration
    | function-declaration
    | class-declaration
    | initializer-declaration
    ;

initializer-declaration
    : INIT parameters block         { $$ = FunctionDeclaration(); }
    ;

class-declaration
    : CLASS id class-body                       { $$ = new ClassDeclaration($2, $3); }
    ;

class-body
    : LCBRAC RCBRAC stat-end                    { $$ = []; }
    | LCBRAC declarations RCBRAC stat-end       { $$ = $2; }
    ;

declarations
    : declaration                     { $$ = [$1]; }
    | declarations declaration        { $$ = $1; $$.push($2); }
    ;

function-declaration
    : FUNC id parameters ARROW type block  { $$ = new FunctionDeclaration($2, $3, $6, $5) }
    | FUNC id parameters block             { $$ = new FunctionDeclaration($2, $3, $4) }
    ;

parameters
    : LBRAC RBRAC                   { $$ = []; }
    | LBRAC parameters-list RBRAC   { $$ = $2; }
    ;

parameters-list
    : parameter { $$ = [$1] }
    | parameters-list COMMA parameter { $$ = $1; $$.push($3); }
    ;

parameter
    : id type-annotation    { $$ = new Parameter($1, $2) }
    | id id type-annotation { $$ = new Parameter($2, $3, $1) }
    ;

let-declaration
    : LET pattern ASSIGN expression stat-end  { $$ = new ConstantDeclaration($2, $4) }
    ;

var-declaration
    : VAR pattern ASSIGN expression stat-end { $$ = new VariableDeclaration($2, $4) }
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
    : id COL type                              { $$ = $3; $$.id = $1.value }
    | type                                     { $$ = $1; }
    ;

stat-end
    : NL
    | SEM
    | EOF
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

boolean
    : TRUE                      { $$ = new BoolLiteral($1) }
    | FALSE                     { $$ = new BoolLiteral($1) }
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
    | boolean
    ;

parenthesized-expression
    : LBRAC comma-separated-expression RBRAC { $$ = new ParenthesizedExpression($2) },
    | LBRAC RBRAC                            { $$ = new ParenthesizedExpression() },
    ;

expression-binary-operator
    : expression ASTERIX expression        { $$ = new OperatorCall($2, $1, $3) }
    | expression DIV expression            { $$ = new OperatorCall($2, $1, $3) }
    | expression PLUS expression           { $$ = new OperatorCall($2, $1, $3) }
    | expression MINUS expression          { $$ = new OperatorCall($2, $1, $3) }
    | expression DOT expression            { $$ = new MemberAccess($1, $3) }
    | expression RNGICL expression         { $$ = new OperatorCall($2, $1, $3) }
    | expression RNGECL expression         { $$ = new OperatorCall($2, $1, $3) }
    | expression DOUBLE_ASSIGN expression  { $$ = new LogicalOperatorCall("==", $1, $3) }
    | expression ASSIGN expression         { $$ = new AssignmentStatement($1, $3); }
    ;

function-call
    : id parenthesized-expression { $$ = new FunctionCall($1, $2) }
    ;

comma-separated-expression
    : expression-or-expression-with-id                                  { $$ = [$1] },
    | comma-separated-expression COMMA expression-or-expression-with-id { $$ = $1; $$.push($3) }
    ;

 expression-or-expression-with-id
    : expression
    | id COL expression { $$ = $3; $$.id = $1.value }
    ;