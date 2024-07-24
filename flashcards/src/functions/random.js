/*function LoadRows(props) {
  if(props.content == null){return (null)}
  function recursiveFnct(input)
  {
    if(input == null){return (null)}

        if(typeof input !== "object") {
          return (<td>{input}</td>)
        } else if(Array.isArray(input)) {

          function f() {
            const head = []
            const headerRow = []
            const headMap = input.map((child) => {
              
              if(typeof child == 'Object') {
                
                 headerRow.push(child.keys().map((key) => 
                  {
                    if(keys.find(key) === undefined){
                      head[i] = key;
                     return  <th>{key}</th>
                    }
                  }
                ))
                
                
                i=i+1;
              }
            })
            for (const i = 0; i<input.length< i++) {
              const child = input[i]
              if(typeof(input) == 'Object') {

              }
            }
          }
          const keys = []
          var i = 0;
          <tr>
          { 
          }
          </tr>


          return(
            <tr>
            {input.map(recursiveFnct)}
            </tr>
          )

        } else {
          const result = []
          var i = 0;

          for (const property in input) {
            result[i] = recursiveFnct(property);
            i+=1;
          }
          return (
            <tr>
              {result}
            </tr>
          );
            
        }
      
      
  }
  return(
    <table>
      {recursiveFnct(props.content)}
    </table>
    
  )
}*/
