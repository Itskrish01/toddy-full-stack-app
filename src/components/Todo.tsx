import { Checkbox } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Import React Query hooks
import axios from 'axios';
import { useToken } from '../hooks/useToken';
import toast from 'react-hot-toast';

type Props = {
    _id: string
    todoTitle: string,
    description: string,
    dueDate: Date,
    completed: boolean,
    className: string
}

const Todo = (props: Props) => {
    const dueDateObject = new Date(props.dueDate);
    const { token } = useToken()
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = dueDateObject.toLocaleDateString(undefined, options);
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
                    toast.success('Successfully selected the task as completed!')
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

    return (
        <li
            onClick={() => navigate(`/todo/${props._id}`, {
                state: {
                    modalOpen: true
                }
            })}
            className={`flex items-start gap-3 px-5 py-5 hover:bg-secondary-50 hover:border-secondary-50 bg-white rounded-md shadow hover:shadow-md cursor-pointer border border-gray-100 transition-all duration-300 ${props.className}`}
        >
            <Checkbox
                defaultSelected={props.completed}
                radius="full"
                color="primary"
                className="mt-1 px-1 py-0 text-xl"
                onChange={handleCheckboxChange}
            />
            <div className="flex flex-col flex-grow">
                <h5 className="text-base font-semibold text-gray-900">
                    {props.todoTitle}
                </h5>
                {props.description && (
                    <p className="text-sm text-gray-600 mt-1">{props.description}</p>
                )}
                {props.dueDate && (
                    <div className="mt-2">
                        <p className="text-sm text-gray-600 font-semibold">
                            {formattedDate} {/* Replace with your formatted date */}
                        </p>
                    </div>
                )}
            </div>
        </li>
    )
}

export default Todo;
