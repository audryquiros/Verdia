import {Router} from 'express';
const router=Router();
router.get('/',(_req,res)=>res.json({ok:true,service:'verdia-api',status:'ready'}));
export default router;
