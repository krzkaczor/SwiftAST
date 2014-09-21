/* lexical grammar */
%lex

%x string

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

[0-9]+"."[0-9]+        return o ('FLOAT_NUMBER');
[0-9]+                return o ('NUMBER');


"_"                   return o ('USCORE');
"->"                  return o ('ARROW');
"."                   return o ('DOT');
","                   return o ('COMMA');
":"                   return o ('COL');
";"                   return o ('SEM');
\n                    return o ('NL');



["]                    this.begin("string");
<string>["]            this.popState();
<string>[^"\n]*        return "STRING";
<string>[\n]           return "NEWLINE_IN_STRING";
<string><<EOF>>        return "EOF_IN_STRING";


/* LITERALS */
[a-zA-Z][a-zA-Z0-9]*  return o ('IDENT');

\s+                   /* skip whitespace */

<<EOF>>               return o ('EOF');