import { useState, useActionState, useEffect } from 'react';
import './LoginForm.css';

interface LoginFormErrors {
    login: string;
    password: string;
    confirmPassword: string;
    email: string;
    phone: string;
    gender: string;
    dob: string;
    languages: string;
    additionalInfo: string;
    photo: string;
}

const Anketa = () => {
    // начальное состояние формы
    const initialFormState = {
        login: '',
        password: '',
        confirmPassword: '',
        email: '',
        phone: '',
        gender: '',
        dob: '',
        languages: [],
        additionalInfo: '',
        photo: ''
    };

    // состояние формы
    const [formState, setFormState] = useState(initialFormState);
    // состояние ошибок !!!
    const [errors, setErrors] = useState({});

    // эффект для принудительного обновления формы после появления ошибок
    useEffect(() => {
        // если есть ошибки, принудительно обновляем форму, чтобы отобразить чекбоксы и радиокнопки
        if (Object.keys(errors).length > 0) {
            setFormState((prev) => ({
                ...prev,
                gender: prev.gender, // сохраняем радиокнопки
                languages: [...prev.languages], // сохраняем чекбоксы
            }));
        }
    }, [errors]);

    // функция валидации формы
    const validateForm = () => {
        const newErrors : LoginFormErrors = {};

        // логин: обязателен, 3-20 символов, только буквы, цифры, подчёркивание
        if (!formState.login) {
            newErrors.login = 'Логин обязателен';
        } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(formState.login)) {
            newErrors.login = 'Логин должен быть 3-20 символов, только буквы, цифры, подчёркивание';
        }

        // пароль: обязателен, минимум 8 символов, должен содержать буквы и цифры
        if (!formState.password) {
            newErrors.password = 'Password is required';
        } else if (formState.password.length < 8 || !/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{8,})\S$/.test(formState.password)) {
            newErrors.password = 'Minimum 8 symbols, contains letters, numbers and has no whitespace.';
        }

        // подтверждение пароля: должно совпадать с паролем
        if (!formState.confirmPassword) {
            newErrors.confirmPassword = 'Password confirmation is required';
        } else if (formState.confirmPassword !== formState.password) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // email: если указан, должен быть корректным
        if (formState.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
            newErrors.email = 'Enter correct email address';
        }

        // телефон: если указан, должен соответствовать формату (например, +380630300035)
        if (formState.phone && !/^\+?\d{10,15}$/.test(formState.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Enter correct phone number (10-15 digits)';
        }

        // пол: обязателен
        if (!formState.gender) {
            newErrors.gender = 'Choose gender';
        }

        // дата рождения: если указана, то пользователь должен быть старше 18 лет
        if (formState.dob) {
            const today = new Date();
            const dob = new Date(formState.dob);
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            if (age < 18) {
                newErrors.dob = 'You must be over 18 years old';
            }
        }

        // языки: минимум один язык
        if (formState.languages.length === 0) {
            newErrors.languages = 'Choose at least one language';
        }

        // дополнительная информация: максимум 500 символов
        if (formState.additionalInfo.length > 500) {
            newErrors.additionalInfo = '500 symbols maximum';
        }

        // TODO: Fix the jpeg/png check, the type is string but some file type is expected
        // фото: если указано, только изображения (jpeg, png), максимум 5МБ
        // if (formState.photo && !['image/jpeg', 'image/png'].includes(formState.photo.type)) {
        //     newErrors.photo = 'Допустимы только файлы JPEG или PNG';
        //     console.error('Photo accepts jpeg and png only. Detected type was not an image');
        // } else if (formState.photo && formState.photo.size > 5 * 1024 * 1024) {
        //     console.error('File size is too big! (5 MB limit)');
        // }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // хук useActionState
    const [State, formAction, isPending] = useActionState(
        async (prevState, formData) => {
            // синхронизируем formState с FormData перед валидацией
            const updatedState = {
                ...formState,
                ...Object.fromEntries(formData.entries()),
                languages: formData.getAll('languages'),
                photo: formState.photo, // сохраняем текущий файл
            };
            setFormState(updatedState);

            // проверяем валидацию
            if (!validateForm()) {
                return updatedState; // возвращаем обновлённое состояние
            }

            try {
                const entries = {
                    ...updatedState,
                    photo: updatedState.photo ? updatedState.photo : null,
                };
                const login = formData.get('login') || '';
                const response = await fetch('https://jsonplaceholder.typicode.com/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: login })
                });
                if (response.ok) {
                    console.log('Form response status:', response.status);
                    console.debug('Sent data:', entries);

                    setErrors({}); // очищаем ошибки
                    setFormState(initialFormState); // сбрасываем форму
                    return initialFormState;
                } else {
                    throw new Error('Server error: ' + response.status);
                }
            } catch (error) {
                console.error('Error happened when sending data. ' + error.message);
                return updatedState; // возвращаем обновлённое состояние
            }
        },
        initialFormState
    );

    // обработчик изменений для текстовых полей, select, textarea, radio
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({
            ...prev,
            [name]: value
        }));
        // очищаем все ошибки при изменении любого поля
        setErrors({});
    };

    // обработчик изменений для checkbox (languages)
    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormState((prev) => {
            const languages = checked
                ? [...prev.languages, value]
                : prev.languages.filter((lang) => lang !== value);
            return { ...prev, languages };
        });
        // очищаем все ошибки при изменении
        setErrors({});
    };

    // обработчик изменений для файла
    const handleFileChange = (e) => {
        const file = e.target.files[0] || null;
        setFormState((prev) => ({
            ...prev,
            photo: file
        }));
        // очищаем все ошибки при изменении
        setErrors({});
    };

    // обработчик сброса формы
    const handleReset = () => {
        setFormState(initialFormState);
        setErrors({});
    };

    return (
        <div className="anketa-container">
            <form action={formAction}>
                <fieldset className="anketa-fieldset">
                    <legend className="anketa-legend">User registration</legend>

                    {/* логин */}
                    <label htmlFor="login" className="anketa-label">Login (required)</label>
                    <input
                        autoComplete="username"
                        type="text"
                        id="login"
                        name="login"
                        value={formState.login}
                        onChange={handleInputChange}
                        className="anketa-input"
                        required
                    />
                    {errors.login && <span className="anketa-error">{errors.login}</span>}<br/>

                    {/* пароль */}
                    <label htmlFor="password" className="anketa-label">Password (required)</label>
                    <input
                        autoComplete="new-password"
                        type="password"
                        id="password"
                        name="password"
                        value={formState.password}
                        onChange={handleInputChange}
                        className="anketa-input"
                        required
                    />
                    {errors.password && <span className="anketa-error">{errors.password}</span>}<br/>

                    {/* подтверждение пароля */}
                    <label htmlFor="confirmPassword" className="anketa-label">Confirm password</label>
                    <input
                        autoComplete="new-password"
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formState.confirmPassword}
                        onChange={handleInputChange}
                        className="anketa-input"
                        required
                    />
                    {errors.confirmPassword && <span className="anketa-error">{errors.confirmPassword}</span>}<br/>

                    {/* электронная почта */}
                    <label htmlFor="email" className="anketa-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleInputChange}
                        className="anketa-input"
                    />
                    {errors.email && <span className="anketa-error">{errors.email}</span>}<br/>

                    {/* телефон */}
                    <label htmlFor="phone" className="anketa-label">Phone</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formState.phone}
                        onChange={handleInputChange}
                        className="anketa-input"
                    />
                    {errors.phone && <span className="anketa-error">{errors.phone}</span>}<br/>

                    {/* пол */}
                    <label className="anketa-label">Gender:</label><br/>
                    <input
                        type="radio"
                        id="male"
                        name="gender"
                        value="Мужчина"
                        checked={formState.gender === 'Мужчина'}
                        onChange={handleInputChange}
                        className="anketa-radio"
                    />
                    <label htmlFor="male" className="anketa-radio-label">Male</label><br/>
                    <input
                        type="radio"
                        id="female"
                        name="gender"
                        value="Женщина"
                        checked={formState.gender === 'Женщина'}
                        onChange={handleInputChange}
                        className="anketa-radio"
                    />
                    <label htmlFor="female" className="anketa-radio-label">Female</label>
                    {errors.gender && <span className="anketa-error">{errors.gender}</span>}<br/>

                    {/* дата рождения */}
                    <label htmlFor="dob" className="anketa-label">Date of Birth:</label>
                    <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={formState.dob}
                        onChange={handleInputChange}
                        className="anketa-input"
                    />
                    {errors.dob && <span className="anketa-error">{errors.dob}</span>}<br/>



                    {/* иностранные языки */}
                    <label className="anketa-label">Foreign languages:</label><br/>
                    {['english', 'french', 'german', 'spanish', 'italian', 'russian', 'japanese', 'korean', 'turkish'].map(lang => (
                        <div key={lang}>
                            <input
                                type="checkbox"
                                id={lang}
                                name="languages"
                                value={lang}
                                checked={formState.languages.includes(lang)}
                                onChange={handleCheckboxChange}
                                className="anketa-checkbox"
                            />
                            <label htmlFor={lang} className="anketa-checkbox-label">
                                {lang[0].toUpperCase() + lang.slice(1)}
                            </label><br/>
                        </div>
                    ))}
                    {errors.languages && <span className="anketa-error">{errors.languages}</span>}<br/>

                    {/* дополнительная информация */}
                    <label htmlFor="additionalInfo" className="anketa-label">Additional info:</label><br/>
                    <textarea
                        name="additionalInfo"
                        id="additionalInfo"
                        rows = {4}
                        cols = {50}
                        value={formState.additionalInfo}
                        onChange={handleInputChange}
                        className="anketa-textarea"
                    ></textarea>
                    {errors.additionalInfo && <span className="anketa-error">{errors.additionalInfo}</span>}<br/>

                    {/* загрузка фото */}
                    <label htmlFor="photo" className="anketa-label">Avatar:</label>
                    <input
                        type="file"
                        id="photo"
                        name="photo"
                        onChange={handleFileChange}
                        className="anketa-input"
                    />
                    {errors.photo && <span className="anketa-error">{errors.photo}</span>}<br/>

                    {/* кнопки */}
                    <input
                        type="submit"
                        value="Submit"
                        disabled={isPending}
                        className="anketa-button anketa-button-submit"
                    />
                    <input
                        type="reset"
                        value="Reset"
                        onClick={handleReset}
                        className="anketa-button anketa-button-reset"
                    />
                </fieldset>
            </form>
        </div>
    );
};

export default Anketa;