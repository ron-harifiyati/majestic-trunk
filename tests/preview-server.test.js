const test=require('node:test');
const {execFileSync}=require('node:child_process');
test('local preview returns the branded error document with 404 and correct HEAD behaviour',()=>{
 execFileSync('python3',['tests/test_preview_server.py'],{stdio:'pipe'});
});
