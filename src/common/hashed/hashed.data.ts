const bcrypt = require('bcryptjs')



export const HashData = async (input: string)=>{
    const salt = 10;
    const hashed = await bcrypt.hash(input, salt);
    return hashed
}

export const comparedHashed = async(userInput: string, dbInput: string): Promise<Boolean>=>{
   return await bcrypt.compare(userInput, dbInput );

}