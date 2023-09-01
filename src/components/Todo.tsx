import { useEffect } from 'react'
import { Card, CardBody, Checkbox, Tooltip } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Import React Query hooks
import axios from 'axios';
import { useToken } from '../hooks/useToken';
import { format } from 'date-fns';
import { hasDatePassed } from './lib/utils';
import { toast } from './ui/use-toast';
import _ from 'lodash';

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
    const truncatedDescription = _.truncate(
        props?.description, {
        'length': 100,
        'omission': '...'
    }
    );
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
        if (hasDatePassed(props.dueDate) && props.dueDate) {
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
        <Card
            isPressable
            onPress={() => navigate(`/todo/${props._id}`, {
                state: {
                    modalOpen: true
                }
            })}
            className={`border-t-4 border-gray-500 ${props.dueDate !== null && hasDatePassed(props.dueDate) ? 'border-red-600' : 'border-gray-500'}`}
            shadow='sm'
        >
            <CardBody className={`flex flex-row items-start cursor-pointer gap-3 px-5 py-4 hover:bg-secondary-50 hover:border-secondary-50  ${props.className}`}>
                <Checkbox
                    defaultSelected={props.completed}
                    radius="full"
                    color="secondary"
                    className="mt-1 px-1 py-0 text-xl"
                    onChange={handleCheckboxChange}

                />
                <div className="flex flex-col flex-grow">
                    <h5 className="text-lg font-medium text-gray-900">
                        {props.todoTitle}
                    </h5>
                    {props.description && (
                        <p className="text-sm text-gray-600 mt-1">{truncatedDescription}</p>
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
            </CardBody>
        </Card>
    )
}

export default Todo;
