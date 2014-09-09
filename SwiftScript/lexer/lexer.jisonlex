/* lexical grammar */
%lex
%%

"="                   return o ('ASSIGN');

/* OPERATORS*/
"*"                   return o ('ASTERIX');
"+"                   return o ('PLUS');
"..."                 return o ('RNGICL');
"..<"                 return o ('RNGECL');

"let"                 return o ('LET');
"return"              return o ('RETURN');
"func"                return o ('FUNC');
"for"                 return o ('FOR');
"in"                  return o ('IN');

"["                   return o ('LSBRAC');
"]"                   return o ('RSBRAC');
"{"                   return o ('LCBRAC');
"}"                   return o ('RCBRAC');
"("                   return o ('LBRAC');
")"                   return o ('RBRAC');

[0-9]+\.[0-9]+        return o ('FLOAT_NUMBER');
[0-9]+                return o ('NUMBER');


"->"                   return o ('ARROW');
"."                   return o ('DOT');
","                   return o ('COMMA');
":"                   return o ('COL');
";"                   return o ('SEM');
\n                    return o ('NL');

/* LITERALS */
[a-zA-Z][a-zA-Z0-9]*  return o ('IDENT');

\s+                   /* skip whitespace */

<<EOF>>               return o ('EOF');