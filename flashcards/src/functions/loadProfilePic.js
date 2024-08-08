export default async function loadProfilePic(setPic) {
  const test= await fetch('http://localhost:3500/profilepic', {method: 'get', credentials: "include", headers: {
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Origin": true,      
    "Access-Control-Allow-Headers": true, 
    "Access-Control-Allow-Methods": true }})
    const c = await test.arrayBuffer()
    console.log(c)
    if(!c){
      console.log('yeahhh')
      return
    } else {
      console.log('getting pic...')
      const uint8array = new Uint8Array(c)
      const Blob = new File([uint8array], 'name', {'type' : 'image/png'});
      const url = URL.createObjectURL(Blob);
      setPic(url)
    }
}