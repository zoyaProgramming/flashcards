

export async function uploadProfilePic (image) {
  if(image instanceof File){
    console.log(image);

    const reader = new FileReader();
    
      new Promise((resolve, reject) => {
        
        reader.onload =  function(event){
          
          const arrayBuffer = event.target.result
         //const uint8Array = new Uint8Array(arrayBuffer);
          //console.log(uint8Array.slice(0, 200).toString())
          const base64String = event.target.result.split(',')[1]; // Extract Base64 part
          console.log(base64String)
          resolve(base64String)
        }
      }).then((value) => {

        const binaryString = window.atob(value)
        function base64ToUint8Array(base64) {
          const binaryString = window.atob(base64)
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
        
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
        
          return bytes;
        }
        // note: this actually works
        const tester = base64ToUint8Array(value)
        
        async function callBackendAPI() {
         
          const userExists = await fetch('http://localhost:3500/profilepic',{method: 'post', credentials: "include", headers: {
            'Content-Type': 'application/json',
            'Content-Transfer-Encoding': 'base64',
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": true,      
            "Access-Control-Allow-Headers": true, 
            "Access-Control-Allow-Methods": true },
          body: JSON.stringify({data: binaryString})})

            if(userExists.ok){
              console.log('success')
            }
          }

          callBackendAPI()
          console.log('aaaaa')
      })
     reader.readAsDataURL(image);
    }
    
  
}





export async function test(image, set) {
  const reader = new FileReader();
    
      new Promise((resolve, reject) => {
        
        reader.onload =  function(event){
          
          const arrayBuffer = event.target.result
         // const uint8Array = new Uint8Array(arrayBuffer);
        //  console.log(uint8Array.slice(0, 200).toString())
          const base64String = event.target.result.split(',')[1]; // Extract Base64 part
        
          resolve(base64String)
        }
      }).then((value) => {


        function base64ToUint8Array(base64) {
          const binaryString = window.atob(base64)
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
        
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
        
          return bytes;
        }
        // note: this actually works
         const tester = base64ToUint8Array(value)
        const b = image.name;
        const otherFile = new File([tester], b, {type: 'image/jpeg'})
        set(URL.createObjectURL(otherFile))
        console.log('otherfile: ')
        console.log(otherFile)
        console.log('image: ')
        console.log(image)
      })
      if(image instanceof File)reader.readAsDataURL(image);
        

}