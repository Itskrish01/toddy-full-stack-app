import { useEffect } from 'react'
import { Checkbox, Tooltip } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Import React Query hooks
import axios from 'axios';
import { useToken } from '../hooks/useToken';
import { format } from 'date-fns';
import { hasDatePassed } from './lib/utils';
import { toast } from './ui/use-toast';

type Props = {
    _id: string
    todoTitle: string,
    description: string,
    dueDate: Date,
    completed: boolean,
    className: string
}


const Todo = (props: Props) => {
    const { token } = useToken()
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const updateCompletionMutation = useMutation(
        async (updatedIsComplete: boolean) => {
            const response = await axios.put(
                `https://plum-jittery-bull.cyclic.cloud/todos/${props._id}`,
                {
                    completed: updatedIsComplete,
                },
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );
            return response.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['todos'] });
                if (!props.completed) {
                    toast({
                        title: "Successfully selected the task as completed",
                        description: "It is simple as that to add todos",
                    })
                }
            },
            onError: (error) => {
                // @ts-expect-error it is working fine even with error
                toast.error(error.response?.data.error);
            }
        }
    );

    const handleCheckboxChange = () => {
        const updatedIsComplete = !props.completed;
        updateCompletionMutation.mutateAsync(updatedIsComplete);
    };

    useEffect(() => {
        if (hasDatePassed(props.dueDate)) {
            toast({
                variant: "destructive",
                title: "Uh oh! Your todo's due date has passed",
                description: (

                    <code className="text-white">
                        todo: {props.todoTitle}
                    </code>

                ),
            })
        }
    }, [props.dueDate])


    return (
        <li
            onClick={() => navigate(`/todo/${props._id}`, {
                state: {
                    modalOpen: true
                }
            })}
            className={`flex items-start gap-3 px-5 py-4 hover:bg-secondary-50 hover:border-secondary-50 bg-white rounded-md shadow hover:shadow-md cursor-pointer border border-gray-100 transition-all duration-300 ${props.className}`}
        >
            <Checkbox
                defaultSelected={props.completed}
                radius="full"
                color="primary"
                className="mt-1 px-1 py-0 text-xl"
                onChange={handleCheckboxChange}
            />
            <div className="flex flex-col flex-grow">
                <h5 className="text-lg font-medium text-gray-900">
                    {props.todoTitle}
                </h5>
                {props.description && (
                    <p className="text-sm text-gray-600 mt-1">{props.description}</p>
                )}
                <div className='flex mt-1'>
                    {props.dueDate && (
                        hasDatePassed(props.dueDate) ? (
                            <Tooltip key="foreground" color="danger" content="The due date has passed" placement='bottom' className="capitalize">
                                <div className="mt-2 bg-red-400/30 px-2 py-1 rounded-lg">
                                    <p className="text-sm text-red-600 font-medium">
                                        {format(new Date(props.dueDate), 'PP')}
                                    </p>
                                </div>
                            </Tooltip>
                        ) : (
                            <Tooltip key="foreground" color="foreground" content="The due date has not passed! 🎉" placement='bottom' className="capitalize">
                                <div className="mt-2 bg-gray-400/30 px-2 py-1 rounded-lg">
                                    <p className="text-sm text-gray-600 font-medium">
                                        {format(new Date(props.dueDate), 'PP')}
                                    </p>
                                </div>
                            </Tooltip>
                        )


                    )}
                </div>
            </div>
        </li>
    )
}

export default Todo;
