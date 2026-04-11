
import {syncCurrentuser} from "@/lib/sync-user";
import { use } from "react";
export async function GET() {
    try{
        const user =await syncCurrentuser();
        if(!user){
            return Response.json({chats:[]},{status:401});
        }
        const chats=await prisma.chat.findMany({
            where:{userId:user.id},
            orderBy:{createAt:"desc"},
        });
        return Response.json({chats});
        
    }
    catch(error){
        console.error("Error fetching chat history:",error);
        return Response.json({chats:[]},{status:500});
    }
    
}
export async function DELETE(){
    try{
        const user =await syncCurrentuser();
        if(!user){
            return Response.json({error:"Unauthorized"},{status:401});
        }
        await prisma.chat.deleMany({
            where:{userId:user.id},

        });
        return Response.json({success:true});
    }
    catch(error){
        console.error("Error deleting chat history:",error);
        return Response.json({error:"Error deleting chat history"},{status:500});
    }

}