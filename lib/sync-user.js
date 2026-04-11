import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
export async function syncCurrentuser() {
    try{
        const clerkuser = await currentUser();
        if(!clerkuser){
            return null;
        }
        const email=clerkuser.emailAddresses[0]?.emailAddress;
        if(!email){
            throw new error("User not Found");
        }
        let user = await prisma.user.findUnique({where:
            {clerkuserID: clerkuser.id},
        });
        if(user){
            user=await prisma.user.update(
                {where:{id: user.id},
            data:{
                email:email,
                name: `${clerkuser.firstName ||""} ${clerkuser.lastName||""}`,
                
            },});
        }
        else{
            user=await prisma.user.create({
                data:{
                    clerkuserID:clerkuser.id,
                    name:`${clerkuser.firstName||""} ${clerkuser.lastName||""}`.trim(),
                    email:email,

                },
                
            });
            console.log(`New user created: ${email}`);

        }
        return user;
            
    }
    catch(error){
        console.error("Error Syncing User :",error);
        throw error;

    }
    
    
}