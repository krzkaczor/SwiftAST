/* lexical grammar */
%lex

%x string

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

[0-9]+"."[0-9]+       return o ('FLOAT_NUMBER');
[0-9]+                return o ('NUMBER');




["]                   this.begin("string");
<string>["]           this.popState();
<string>[^"\n]*       return o ("STRING");


/* LITERALS */
[a-zA-Z][a-zA-Z0-9]*  return o ('IDENT');

\s+                   /* skip whitespace */