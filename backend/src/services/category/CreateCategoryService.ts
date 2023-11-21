import prismaClient from "../../prisma";

interface CategoryRequest {
    name: string;
}

class CreateCategoryService {
    async execute({ name }: CategoryRequest) {

        if (!name || name === '') {
            throw new Error('Nome inválido.')
        }

        // Verificar se já existe uma categoria com o mesmo nome
        const existingCategory = await prismaClient.category.findFirst({
            where: {
                name: name,
            },
        });

        if (existingCategory) {
            throw new Error('Categoria já cadastrada!');
        }

        const category = await prismaClient.category.create({
            data: {
                name: name,
            },
            select: {
                id: true,
                name: true,
            }
        })


        return category;

    }
}

export { CreateCategoryService }