import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "./lib/utils";
import { Calendar } from "./ui/calendar";
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useToken } from "../hooks/useToken";
import toast from "react-hot-toast";

const todoSchema = yup.object().shape({
    todoTitle: yup.string().required(),
    description: yup.string().optional(),
    dueDate: yup.date().optional(),
});

interface TodoData {
    todoTitle: string | undefined;
    description: string | undefined;
    dueDate: Date | "";
    completed: boolean | undefined;
}




const AddTodoInputBox = () => {
    const { token } = useToken()
    const { register, handleSubmit, formState: { errors }, control, setValue } = useForm<TodoData>({
        // @ts-expect-error it is working fine even with error
        resolver: yupResolver(todoSchema)
    });

    const createTodo = async (data: TodoData) => {
        try {
            const { data: response } = await axios.post('https://todd-backend.onrender.com/todos', data, {
                headers: {
                    'Authorization': `${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating todo:', error);
            throw error;
        }
    };

    const queryClient = useQueryClient()

    const mutation = useMutation(createTodo, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] })
            toast.success('Successfully added task')

            setValue('todoTitle', "")
            setValue('dueDate', "")
            setValue('description', "")
        },
    });

    const onSubmit = (data: TodoData) => {
        mutation.mutate({
            ...data,
            completed: false,
            dueDate: data.dueDate ? data.dueDate : ""
        });
    };

    return (
        <form className={`p-5 bg-[#fff] rounded-lg shadow ${errors.todoTitle ? 'border border-danger-500' : ''}`} onSubmit={handleSubmit(onSubmit)}>
            <input {...register('todoTitle')} type="text" className={`text-base w-full focus:outline-none text-primaryDark placeholder:text-[#c5c7d7] ${errors.todoTitle ? 'placeholder:text-danger-500' : ''}`} placeholder={errors.todoTitle ? 'Task title is required' : 'Add a new Task here...'} />
            <textarea {...register('description')} cols={30} rows={3} placeholder="Description" className="w-full px-0.5 mt-2 text-sm focus:outline-none text-primaryDark resize-none placeholder:text-[#c5c7d7]"></textarea>
            <div className="flex justify-between">
                <Controller control={control} name='dueDate' render={({ field }) => (
                    <Popover>
                        <PopoverTrigger>
                            <Button
                                variant={"bordered"}
                                className={cn(
                                    "w-[140px] pl-3 text-left font-normal text-gray-500",
                                )}
                            >
                                <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                                {field.value ? (
                                    format(new Date(field.value), "PP")
                                ) : (
                                    <span>Due date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={new Date(field.value)}
                                onSelect={(date) => field.onChange(date)}
                                disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                )} />
                <Button color="secondary" className='' type='submit' isLoading={mutation.isLoading} spinner={
                    <svg
                        className="animate-spin h-5 w-5 text-current"
                        fill="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            fill="currentColor"
                        />
                    </svg>
                }>
                    Add todo
                </Button>
            </div>
        </form>
    );
};

export default AddTodoInputBox;
