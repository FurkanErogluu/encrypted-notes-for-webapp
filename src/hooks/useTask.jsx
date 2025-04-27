import { useState, useEffect } from 'react';

const useTask = () => {
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });

    const [categories, setCategories] = useState(['İş', 'Kişisel', 'Okul', 'Alışveriş']);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = (task) => {
        const newTask = {
            id: Date.now(),
            title: task.title,
            description: task.description || '',
            completed: false,
            priority: task.priority || 'normal',
            category: task.category || 'Genel',
            tags: task.tags || [],
            dueDate: task.dueDate || null,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        setTasks([...tasks, newTask]);
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const toggleComplete = (id) => {
        setTasks(tasks.map(task =>
            task.id === id
                ? { ...task, completed: !task.completed, updatedAt: new Date() }
                : task
        ));
    };

    const updateTask = (id, updatedTask) => {
        setTasks(tasks.map(task =>
            task.id === id
                ? { ...task, ...updatedTask, updatedAt: new Date() }
                : task
        ));
    };

    const addCategory = (category) => {
        if (!categories.includes(category)) {
            setCategories([...categories, category]);
        }
    };

    const addTag = (tag) => {
        if (!tags.includes(tag)) {
            setTags([...tags, tag]);
        }
    };

    const filterTasks = (filters) => {
        return tasks.filter(task => {
            if (filters.completed !== undefined && task.completed !== filters.completed) return false;
            if (filters.priority && task.priority !== filters.priority) return false;
            if (filters.category && task.category !== filters.category) return false;
            if (filters.tags && !filters.tags.every(tag => task.tags.includes(tag))) return false;
            if (filters.searchTerm && !task.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
            return true;
        });
    };

    const sortTasks = (tasks, sortBy) => {
        return [...tasks].sort((a, b) => {
            switch (sortBy) {
                case 'priority':
                    const priorityOrder = { high: 0, normal: 1, low: 2 };
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                case 'dueDate':
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'createdAt':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                default:
                    return 0;
            }
        });
    };

    return {
        tasks,
        categories,
        tags,
        addTask,
        deleteTask,
        toggleComplete,
        updateTask,
        addCategory,
        addTag,
        filterTasks,
        sortTasks
    };
};

export default useTask; 