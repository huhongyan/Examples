define(['handlebars.runtime'],function(Handlebars){
	Handlebars = Handlebars.default;

    Handlebars.registerHelper("x", function (expression, options) {
  var fn = function(){}, result;

  // in a try block in case the expression have invalid javascript
  try {
    // create a new function using Function.apply, notice the capital F in Function
    fn = Function.apply(
      this,
      [
        'window', // or add more '_this, window, a, b' you can add more params if you have references for them when you call fn(window, a, b, c);
        'return ' + expression + ';' // edit that if you know what you're doing
      ]
    );
  } catch (e) {
    console.warn('[warning] {{x ' + expression + '}} is invalid javascript', e);
  }

  // then let's execute this new function, and pass it window, like we promised
  // so you can actually use window in your expression
  // i.e expression ==> 'window.config.userLimit + 10 - 5 + 2 - user.count' //
  // or whatever
  try {
    // if you have created the function with more params
    // that would like fn(window, a, b, c)
    result = fn.bind(this)(window);
  } catch (e) {
    console.warn('[warning] {{x ' + expression + '}} runtime error', e);
  }
  // return the output of that result, or undefined if some error occured
  return result;
});

    Handlebars.registerHelper("xif", function (expression, options) {
        return Handlebars.helpers["x"].apply(this, [expression, options]) ? options.fn(this) : options.inverse(this);
    });

    Handlebars.registerHelper('ifCond', function(v1, v2, options) {
      if(v1 === v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    });
    
    //只判断字符是否相等,不判断类型.
    Handlebars.registerHelper('sif', function(v1, v2, options) {
    	if(v1 == v2) {
    		return options.fn(this);
    	}
    	return options.inverse(this);
    });


    Handlebars.registerHelper ('truncate', function (str, len) {
        if (str.length > len && str.length > 0) {
            var new_str = str + " ";
            new_str = str.substr (0, len);
            new_str = str.substr (0, new_str.lastIndexOf(" "));
            new_str = (new_str.length > 0) ? new_str : str.substr (0, len);

            return new Handlebars.SafeString ( new_str +'...' ); 
        }
        return str;
    });

    Handlebars.registerHelper("indexTo4Str",function(index){
        var new_str = (index+1).toString();
        if (new_str.length==1) {
            new_str = "000"+new_str;
            return new Handlebars.SafeString (new_str); 
        }else if (new_str.length==2) {
            new_str = "00"+new_str;
            return new Handlebars.SafeString (new_str); 
        }else if (new_str.length==3) {
            new_str = "0"+new_str;
            return new Handlebars.SafeString (new_str); 
        }
        return new_str;
        
      });
    
    //序号填充为四位，两层循环时，index当前层序号，count外层累计的数量，parentIndex上一层的序号 print_order_no_master_wms 签专用
    Handlebars.registerHelper("xindexTo4Str",function(index,count,parentIndex){
    	var new_str = (index+1).toString();
    	if(parentIndex>0){
    		new_str = (index+count+1).toString();
    	}
        if (new_str.length==1) {
            new_str = "000"+new_str;
            return new Handlebars.SafeString (new_str); 
        }else if (new_str.length==2) {
            new_str = "00"+new_str;
            return new Handlebars.SafeString (new_str); 
        }else if (new_str.length==3) {
            new_str = "0"+new_str;
            return new Handlebars.SafeString (new_str); 
        }
        
        return index;
        
      });
    
    // print_order_no_master_wms 签专用
    Handlebars.registerHelper("foreach",function(arr,options) {
        if(options.inverse && !arr.length)
            return options.inverse(this);
        
        return arr.map(function(item,index) {
            var tem=arr[0].orderItemRowsLeng*1;
             for(var i=1;i<index;i++){
                  tem=tem+arr[i].orderItemRowsLeng*1;          
            }
            item.$count=tem;
            item.$index=index;
            return options.fn(item);
        }).join('');
    });
    
    Handlebars.registerHelper('times', function(n, block) {
    	n = eval(n);
    	var accum = '';
        for(var i = 0; i < n; ++i)
            accum += block.fn(i);
        return accum;
    });
    
    Handlebars.registerHelper('xifCond', function(v1, v2, op, options) {

    	v1 = eval(v1);
    	v2 = eval(v2);
    	if(op=="="){
    		if(v1 == v2) return options.fn(this);
    	}
    	if(op=="!="){
    		if(v1 != v2) return options.fn(this);
    	}
    	if(op==">="){
    		if(v1 >= v2) return options.fn(this);
    	}
    	if(op=="<="){
    		if(v1 <= v2) return options.fn(this);
    	}
    	if(op==">"){
    		if(v1 > v2) return options.fn(this);
    	}
    	if(op=="<"){
    		if(v1 < v2) return options.fn(this);
    	}
      return options.inverse(this);
    });
    
 // a4print_conunting_sheet 签专用
    Handlebars.registerHelper("foreachCS",function(arr,options) {
        if(options.inverse && !arr.length)
            return options.inverse(this);
        
        return arr.map(function(item,index) {
        	 item.$index=index + 1;
        	
             if(arr[index].orderItemRowsLength==1||arr[index].orderItemRowsLength==0){
             	item.$orderno=arr[index].orderno;
                item.$bottom="3px solid black;";
             }
//             else if(index==0){
//            	item.$orderno=arr[0].orderno;
//            	item.$bottom="1px solid black;";
//            }
             else if(index==arr.length-1){
            	item.$orderno=arr[index].orderno;
            	item.$bottom="3px solid black;";
            }else{
            	var orderNo=arr[index].orderno;
            	var nextOrderNo=arr[index+1].orderno;
//            	var preOrderNo=arr[index-1].orderno;
//            	if(preOrderNo!=orderNo){
//            		item.$orderno=orderNo;
//                	item.$bottom="1px solid black;";
//            	}else 
            	if(nextOrderNo!=orderNo){
            		item.$orderno=orderNo;
//            		item.$orderno="";
                	item.$bottom="3px solid black;";
            	}else{
            		item.$orderno="";
            		item.$bottom="1px solid black;";
            	}
            }
             if((index+1)%20==0){
	           	item.$bottom="1px solid black;";
	         }
            return options.fn(item);
        }).join('');
    });
    Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
      lvalue = parseFloat(lvalue);
      rvalue = parseFloat(rvalue);
          
      return {
          "+": lvalue + rvalue,
          "-": lvalue - rvalue,
          "*": lvalue * rvalue,
          "/": lvalue / rvalue,
          "%": lvalue % rvalue
      }[operator];
  });

    Handlebars.registerHelper("percent", function(lvalue, operator, rvalue, options) {
      lvalue = parseFloat(lvalue);
      rvalue = parseFloat(rvalue);
          
      return {
          "%": (lvalue / rvalue) * 100
      }[operator];
  });
   
  Handlebars.registerHelper('compare', function(lvalue, rvalue, options) {

    if (arguments.length < 3)
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

    operator = options.hash.operator || "==";

    var operators = {
        '==':       function(l,r) { return l == r; },
        '===':      function(l,r) { return l === r; },
        '!=':       function(l,r) { return l != r; },
        '<':        function(l,r) { return l < r; },
        '>':        function(l,r) { return l > r; },
        '<=':       function(l,r) { return l <= r; },
        '>=':       function(l,r) { return l >= r; },
        'typeof':   function(l,r) { return typeof l == r; }
    }

    if (!operators[operator])
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

    var result = operators[operator](lvalue,rvalue);

    if( result ) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

  });  
    
  	return Handlebars;  
});