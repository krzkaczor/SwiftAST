/* lexical grammar */
%lex

%x string
%x after-dot

%%
<<EOF>>               return o ('EOF');
$                     return o ('EOF');

"=="                  return o ('DOUBLE_ASSIGN');
"="                   return o ('ASSIGN');

"_"                   return o ('USCORE');
"->"                  return o ('ARROW');
"."                   return o ('DOT');
","                   return o ('COMMA');
":"                   return o ('COL');
";"                   return o ('SEM');
\n                    return o ('NL');

/* OPERATORS*/
"*"                   return o ('ASTERIX');
"/"                   return o ('DIV');
"+"                   return o ('PLUS');
"-"                   return o ('MINUS');
"..."                 return o ('RNGICL');
"..<"                 return o ('RNGECL');

/* KEYWORDS */
"let"                 return o ('LET');
"var"                 return o ('VAR');
"class"               return o ('CLASS');
"init"                return o ('INIT');

"return"              return o ('RETURN');
"func"                return o ('FUNC');
"for"                 return o ('FOR');
"in"                  return o ('IN');
"if"                  return o ('IF');
"else"                return o ('ELSE');
"true"                return o ('TRUE');
"false"               return o ('FALSE');

"["                   return o ('LSBRAC');
"]"                   return o ('RSBRAC');
"{"                   return o ('LCBRAC');
"}"                   return o ('RCBRAC');
"("                   return o ('LBRAC');
")"                   return o ('RBRAC');


/* LITERALS */
[a-zA-Z][a-zA-Z0-9]*  return o ('IDENT');
<after-dot>[a-zA-Z][a-zA-Z0-9]*  return o ('IDENT');
<after-dot>[0-9]+     return o ('NUMBER');
[0-9]+"."[0-9]+       return o ('FLOAT_NUMBER');
[0-9]+                return o ('NUMBER');
["]                   this.begin("string");
<string>["]           this.popState();
<string>[^"\n]*       return o ("STRING");

\s+                   /* skip whitespace */