const m="[parse-args] ",i={true:!0,1:!0,false:!1,0:!1},d={str:"string",num:"number",int:"integer",boo:"boolean"},c=new Set(Object.values(d)),w=d.boo,I="help",O="_throwOnErrors",y="_returnErrors",_="_verbose",k="_keepAll",V="_flagUnknowns",A="_ignoreUnknowns",W="_help",a="_helpTemplate",j="type",U="alias",E="required",S="defaultValue",l="description",z="isValid",P="validationError",x="allowedValues",F="nonOptions",H="errors",f=new Set([F,H]),t="{OPTIONS}";function N(n){throw new Error(m+n)}let T=console.log;function q(n){return null==n}function s(n){return!isNaN(n)&&"number"==typeof n}function p(n){return"boolean"==typeof n||n in i}function h(n){return"boolean"==typeof n?n:i[n]}function C(n){return Array.isArray(n)}function D(n){return null!==n&&"object"==typeof n&&!C(n)}function J(n){return"string"==typeof n}function M(n,e){return q(n)?e:n}function R(n){return JSON.stringify(n)}function B(e,n,t,r){function o(n){r('In option "'+e+'" with value "'+t+'": Value is not '+n+".")}switch(n||w){case d.str:return J(t)||o("a string"),t;case d.num:var i=J(t)?parseFloat(t):t;return s(i)||o("a number"),i;case d.int:{const a=J(t)?parseInt(t):t;return s(a)&&!a.toString().includes(".")||o("an integer"),a}case d.boo:return p(t)||o("a boolean"),h(t);default:r('In option "'+e+'" with value "'+t+'": Unrecognized data type "'+v[j]+'"')}}function G(e){D(e)||N("Invalid options given: "+R(e));var t=Object.entries(e);for(let n=0;n<t.length;n++){const[r,o]=t[n];(r.startsWith("_")?function(n,e,t){switch(e){case O:case y:case _:case k:case V:case A:case W:p(t)||N('In API option "'+e+'": Invalid boolean value "'+t+'". Allowed values are '+R(Object.keys(i))+"."),n[e]=h(t);break;case a:J(t)||N('In API option "'+e+'": Value "'+t+'" is not a string.');break;default:N('Unrecognized API option "'+e+'".')}e===W&&n[e]&&q(n[I])&&(n[I]={[j]:d.boo,[U]:"?",[l]:"Show the help text."})}:function(n,e,t){var r='In user option "'+e+'": ';if(e.startsWith("-")&&N(r+'Option names cannot begin with "-".'),f.has(e)&&N(r+'Option name "'+e+'" is reserved for use in the return value.'),q(t))n[e]={};else{D(t)||N(r+"Value is not an object.");const a=new Set;var o=Object.entries(t);for(let n=0;n<o.length;n++){const[s,u]=o[n];if((s.startsWith("-")||s.startsWith("_"))&&N('User option "'+e+"."+s+'" cannot begin with "-" or "_".'),!q(u))switch(s){case j:c.has(u)||i('Unrecognized data type "'+u+'".');break;case U:J(u)||i("Value must be a string."),1!==u.length&&i("Value must be one character only."),"-"!==u&&"_"!==u||i('Option name cannot be "-" or "_".'),a.has(u)&&i("Duplicate option alias."),a.add(u);break;case E:p(u)||i('Invalid boolean value "'+u+'".'),t[s]=h(u);break;case S:q(t[E])||i('"'+E+'" cannot be set when "'+s+'" is set.'),t[s]=B(e+"."+s,t[j],u,N);break;case l:J(u)||i("Value must be a string.");break;case z:u instanceof Function||i("Value must be a function.");break;case P:J(u)||u instanceof Function||i("Value must be a string or a function.");break;case x:C(u)&&0!==u.length||i("Value must be a non-empty array.");for(let n=0;n<u.length;n++)u[n]=B(e+"."+s+"["+n+"]",t[j],u[n],N);break;default:i('Unrecognized user option "'+s+'".')}function i(n){N('In user option "'+e+"."+s+'" of value '+R(u)+": "+n)}}}})(e,r,o)}}const u=20;const g=80-u;function b(e,t){if(e.length<=t)return[e,""];for(let n=t-1;0<=n;n--)if(" "===e[n])return[e.slice(0,n),e.slice(n+1)];return[e.slice(0,t),e.slice(t)]}function r(n){return Object.entries(n).filter(function([n]){return!n.startsWith("_")}).map(function([n,e]){return function(n,e){let t="  "+(e[U]?"-"+e[U]+", ":"")+"--"+n+(e[E]?"=...":""),r=e[l];if(!r)return t;for(t.length>=u-1?t+="\n"+" ".repeat(u):t+=" ".repeat(u-t.length),e=b(r,g),t+=e[0],r=e[1];0<r.length;){var o=b(r,g);t+="\n"+" ".repeat(u)+o[0],r=o[1]}return t}(n,e)}).join("\n")}function o(n){n=M(n,{});const e=M(n[a],"\nOptions:\n\n");n=r(n);return e.includes(t)?e.replace(t,n):e+n}function K(n){T(o(n))}function L(n,e,t,r,o,i){if(n[W]&&o===I&&K(n),!(o in n))return s=e,u=t,c=r,l=o,p=M(i,!0),(a=n)[V]&&u('Unrecognized option "'+c+'".'),void(a[A]||(s[l]=p));var a,s,u,c,l;function f(n){t('In option "'+r+'": '+n)}var p=n[o];if(!p[E]||M(i,"")){n=p[j];i=q(i)?function(n){switch(n||w){case d.str:return"true";case d.num:case d.int:return 0;case d.boo:return!0;default:N('Unrecognized option type "'+n+'".')}}(n):B(r,n,i,t);const h=p[z];if(h&&!h(i)){const b=p[P];let n=b?J(b)?b:b(i):"";n=n?J(n)?n:R(n):"",n?t(n):f('Failed user data validation for "'+i+'".')}const g=p[x];g&&!g.includes(i)&&f('Invalid value "'+i+'". Allowed values are '+R(g)+"."),e[o]=i}else f('Required option value must be non-empty, i.e. "'+r+'=<value>".')}function Q(n,r){q(n)&&q(r)||D(n)&&q(r)||(q(n)||C(n))&&(q(r)||D(r))||N("Invalid arguments ["+R(n)+"] and ["+R(r)+"]."),D(n)?(r=n,n=process.argv):(n=M(n,process.argv),r=M(r,{})),G(r),2<=n.length&&!r[k]&&(n=n.slice(2));const e=Object.entries(r).filter(function([n]){return!n.startsWith("_")}),t={};e.forEach(function([n,e]){return e[U]&&(t[e[U]]=n)});const o={},i=[],a=[];function s(n){r[O]&&N(n),r[y]&&i.push(n),r[_]&&(n=n,T(m+n))}function u(n,e,t){L(r,o,s,n,e,t)}let c=0;for(;c<n.length;c++){const b=n[c];if("--"===b){n.slice(c+1).forEach(function(n){a.push(n)});break}if(b.startsWith("-")){var l=b.indexOf("=");const d=0<l?b.slice(0,l):b;var f=0<l?b.slice(l+1):void 0;if(b.startsWith("--")){const v=d.slice(2);if(v.startsWith("_")||v.startsWith("-")){s('In option "'+b+'": Option names cannot start with "_" or "-".');continue}u(d,v,f)}else{var p=d.slice(1);if(void 0!==f&&1<p.length)s('In option "'+b+'": Cannot share one value for multiple short options.');else for(let n=0;n<p.length;n++){var h=p[n];u("-"+h,M(t[h],h),f)}}}else a.push(b)}const g=e.filter(function([n]){return void 0===o[n]});return g.filter(function([,n]){return n[E]}).forEach(function([n]){s('Missing required option "--'+n+'".')}),g.filter(function([,n]){return!q(n[S])}).forEach(function([n,e]){o[n]=e[S]}),0<a.length&&(o[F]=a),0<i.length&&(o[H]=i),o}module.exports={setOutputPrinter:function(n){T=n},getHelpText:o,printHelp:K,parseArgs:Q,ArgsParser:function(e){return q(e)||D(e)||N('Invalid "options" argument ['+R(e)+"]."),{parse:function(n){Q(n,e)},getHelpText:function(){return o(e)},printHelp:function(){K(e)}}}};