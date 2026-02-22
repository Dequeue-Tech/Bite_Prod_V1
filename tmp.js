const { prisma } = require("./src/lib/prisma");
async function main(){
 const items = await prisma.menuItem.findMany({take:5, select:{id:true,name:true,image:true}});
 console.log(items);
}
main().catch(e=>console.error(e)).finally(()=>prisma.$disconnect());
