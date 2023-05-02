"use client";

import { useEffect, useState } from 'react'
import { Button, Form, Input, Select, Switch, Table } from 'antd'
import styles from '@/styles/search.module.css'
export default function Home() {

    const [searchText, setSearchText] = useState("");
    const [type, setType] = useState("episode");
    const [genreId, setGenreId] = useState(null);
    const [safeMode, setSafeMode] = useState("0");
    const [pageSize, setPageSize] = useState("20");
    const [data, setData] = useState([])
    const [languages, setLanguages] = useState([])
    const [typeAhead, setTypeAhead] = useState("")
    const [show_genres, setShowGenres] = useState(null);
    const [show_podcasts, setShowPodcasts] = useState(null);
    const [activeTab, setActiveTab] = useState(false);
    const [categories, setCategories] = useState();
    const [regions, setRegions] = useState([])
    const [advancedSearch, setAdvancedSearch] = useState(false);


    const searchParams = {
        dateSort: "0",
        type: "episode",
        offset: "0",
        podLength: "10",
        maxPodLength: "30",
        genreId: null,
        publishedBefore: null,
        publishedAfter: "0",
        onlyIn: null,
        language: "English",
        safeMode: "0",
        uniquePodcasts: "0",
        pageSize: "10",
    }

    useEffect(() => {
        getCategories();
        getLanguages();
        getRegions();
    }, [])

    const getSearch = async (searchparams = searchParams) => {
        const searchURL = (genreId !== null || searchParams.genreId !== null) ?
            `http://localhost:3000/api/search/search?q=${searchText}&sort_by_date=${searchparams?.dateSort}&type=${searchparams?.type}&offset=${searchparams?.offset}&len_min=${searchparams?.podLength}&len_max=${searchparams?.maxPodLength}&genre_ids=${searchparams?.genreId || genreId}&published_before=${searchparams?.publishedBefore}&published_after=${searchparams?.publishedAfter}&only_in=${searchparams?.onlyIn}&language=${searchparams?.language}&safe_mode=${searchparams?.safeMode}&unique_podcasts=${searchparams?.uniquePodcasts}&page_size=${pageSize}`
            :
            `http://localhost:3000/api/search/search?q=${searchText}&sort_by_date=${searchparams?.dateSort}&type=${searchparams?.type}&offset=${searchparams?.offset}&len_min=${searchparams?.podLength}&len_max=${searchparams?.maxPodLength}&published_before=${searchparams?.publishedBefore}&published_after=${searchparams?.publishedAfter}&only_in=${searchparams?.onlyIn}&language=${searchparams?.language}&safe_mode=${searchparams?.safeMode}&unique_podcasts=${searchparams?.uniquePodcasts}&page_size=${pageSize}`



        if (!searchText || searchText === "" || searchText === undefined) {
            window.alert("Please Enter a search term")
            return;
        }
        setTypeAhead([]);
        const res = await fetch(searchURL)
            .then((res) => res.json())
            .then((res) => {
                setData(res?.body?.results?.map((podcast) => (
                    {
                        key: podcast?.podcast?.id,
                        id: podcast?.podcast?.id,
                        title: podcast?.podcast?.title_original,
                        duration: `${parseInt(podcast?.audio_length_sec / 60)} mins`,
                        link: podcast?.audio,
                        explicit: podcast?.explicit_content ? "Yes" : "No",
                        image: podcast?.podcast?.image,
                    }
                )))
            })

    }

    const getCategories = async () => {
        const res = await fetch(`http://localhost:3000/api/directory/genres`)
            .then((res) => res.json())
            .then((res) => {
                setCategories(res?.body?.genres)
            })
    }

    const getRegions = async () => {
        const res = await fetch(`http://localhost:3000/api/directory/region`)
            .then((res) => res.json())
            .then((res) => {
                setRegions(res?.body?.regions)
            })
    }

    const getLanguages = async () => {
        const res = await fetch(`http://localhost:3000/api/directory/languages`)
            .then((res) => res.json())
            .then((res) => {
                setLanguages(res?.body?.languages)
            })
    }


    const getTypeAhead = async (query) => {
        const res = await fetch(`http://localhost:3000/api/search/typeahead?q=${query}&show_podcasts=${show_podcasts}&show_genres=${show_genres}&safe_mode=${safeMode}`)
            .then((res) => res.json())
            .then((res) => {
                setTypeAhead(res?.body?.terms)
            })
    }

    const handleChange = (e) => {
        setSearchText(e.target.value)
        getTypeAhead(e.target.value)
    }

    const handleAutoComplete = (entry) => {
        setSearchText(entry);
        setTypeAhead([]);
    }

    const handleCategorySearch = (id, name) => {
        searchParams.genreId = id
        setSearchText(name)
        getSearch(searchParams);
    }


    const onFinish = (values) => {
        searchParams.dateSort = values.dateSort
        searchParams.type = values.type
        searchParams.genreId = values.genreId
        searchParams.language = values.languages
        searchParams.maxPodLength = values.maxPodLength
        searchParams.podLength = values.podLength
        searchParams.safeMode = values.safeMode
        searchParams.uniquePodcasts = values.uniquePodcasts

        getSearch(searchParams);

    };

    const onFinishFailed = (errorInfo) => {

    };

    const columns = [
        {
            title: '',
            dataIndex: 'image',
            key: 'image',
            render: (_, { image }) => (
                <>
                    <img style={{ width: "100px", height: "100px" }} src={image} alt="image" />
                </>
            )
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
        },
        {
            title: 'Link',
            dataIndex: 'link',
            key: 'link',
            render: (_, { link }) => (
                <audio controls="controls">
                    <source src={link} type="audio/mpeg" />
                </audio>
            )
        },
        {
            title: 'Explicit',
            dataIndex: 'explicit',
            key: 'explicit',
        },

    ]


    return (
        <main>
            <h1 style={{ textAlign: "center", marginTop: "32px" }}>ZipiStream Podcast Service</h1>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "60%", padding: "8px", marginBottom: "16px", marginTop: "10%" }}>
                    <div style={{ display: "flex" }}>
                        <input
                            name='search-field'
                            value={searchText}
                            style={{ width: "100%", padding: "16px", marginRight: "8px" }}
                            type="text"
                            placeholder='Find Podcasts...'
                            onChange={handleChange}
                        />
                        <button onClick={() => setAdvancedSearch(!advancedSearch)}>Advanced Search</button>
                    </div>
                    {Array.isArray(typeAhead) && typeAhead.length > 0 && <div style={{ width: "100%", backgroundColor: "white", color: "black" }}>
                        {
                            typeAhead.map((entry) => (
                                <div key={entry} onClick={() => handleAutoComplete(entry)} className={styles?.onOver} style={{ width: "100%", padding: "8px", border: "1px solid grey", cursor: "pointer" }}>
                                    {entry}
                                </div>
                            ))
                        }
                    </div>}
                </div>
                {advancedSearch && <div style={{ width: "60%", backgroundColor: "white", margin: "16px" }}>
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ width: "100%", padding: "16px" }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Type"
                            name="type"
                        >
                            <Select
                                style={{
                                    width: 120,
                                }}
                                onChange={(e) => setType(e)}
                                options={[
                                    {
                                        value: 'episode',
                                        label: 'Episode',
                                    },
                                    {
                                        value: 'podcast',
                                        label: 'Podcast',
                                    },
                                    {
                                        value: 'curated',
                                        label: 'Curated',
                                    }
                                ]}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Sort By Date"
                            name="dateSort"
                        >
                            <Select
                                style={{
                                    width: 120,
                                }}
                                options={[
                                    {
                                        value: '0',
                                        label: 'No',
                                    },
                                    {
                                        value: '1',
                                        label: 'Yes',
                                    },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Minimum Audio Length (mins)"
                            name="podLength"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Maximum Audio Length (mins)"
                            name="maxPodLength"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Hide Explicit Content"
                            name="safeMode"
                        >
                            <Switch />
                        </Form.Item>
                        <Form.Item
                            label="Show Unique Podcast"
                            name="uniquePodcasts"
                        >
                            <Switch />
                        </Form.Item>

                        {
                            type === "episode" &&
                            <>
                                <Form.Item
                                    label="Minimum Episode Count"
                                    name="episode_count_min"
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Maximum Episode Count"
                                    name="episode_count_max"
                                >
                                    <Input />
                                </Form.Item>
                            </>


                        }
                        <Form.Item
                            label="Minimum Update Frequency (Hours)"
                            name="update_freq_min"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Maximum Update Frequency (Hours)"
                            name="update_freq_max"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Genres"
                            name="genreId"
                        >
                            <Select
                                mode='multiple'
                                allowClear
                                style={{
                                    width: 120,
                                }}
                                options={Array.isArray(categories)
                                    && categories.length > 0
                                    && categories.map((genre) => (
                                        {
                                            key: genre.id,
                                            value: genre?.id,
                                            label: genre?.name
                                        }
                                    ))}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Languages"
                            name="languages"
                        >
                            <Select
                                style={{
                                    width: 120,
                                }}
                                options={Array.isArray(languages)
                                    && languages.length > 0
                                    && languages.map((language) => (
                                        {
                                            key: language,
                                            value: language,
                                            label: language
                                        }
                                    ))}
                            />
                        </Form.Item>

                        <Form.Item >
                            <Button style={{ width: "100%" }} type="primary" htmlType="submit">
                                Search
                            </Button>
                        </Form.Item>
                    </Form>


                </div>}
                {!advancedSearch && <button style={{ width: "60%", padding: "16px", marginBottom: "16px" }} onClick={() => getSearch()}>search</button>}
                {data.length > 0 && <Table style={{ width: "60%" }} dataSource={data} columns={columns} />}
            </div>
            <div className={styles.sidebar}>
                <ul className={styles.tabList}>
                    {
                        Array.isArray(categories) && categories.length > 0 && categories.map(category => (
                            <li key={category?.id} className={`${styles.tab} ${activeTab ? styles.active : ""} ${styles.item}`} onClick={() => handleCategorySearch(category?.id, category?.name)}><div>{category.name}</div></li>
                        ))
                    }


                </ul>
            </div>
        </main>
    )
}
