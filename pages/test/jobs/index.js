import { useState } from 'react';
import JobList from '../../../components/JobList.js';
import axios from 'axios';
import Spinner from '../../../components/Loader.js';
import Button from 'react-bootstrap/Button';


// API URL 
const apiUrl = "https://www.zippia.com/api/jobs/";

//API payloads
const data = {
    companySkills: true,
    dismissedListingHashes: [],
    fetchJobDesc: true,
    jobTitle: "Business Analyst",
    locations: [],
    numJobs: 20,
    previousListingHashes: []
}
/**
 * Our main component with name Jobs
 * @param {*} jobList 
 * @returns 
 */
const Jobs = ({ jobList }) => {

    //Using state hook for saving state
    const [myJobs, setMyJobs] = useState(jobList.jobs);
    const [showLoading, updateLoading] = useState(false);
    //Currently I have not provided option to update number of jobs showing but it can be done easily
    const [cardLimit] = useState(10);
    //Using state to store active filter
    const [pastWeekFilterActive, setPastWeekFilterActive] = useState(false);
    const [companyNameFilterActive, setCompanyNameFilterActive] = useState(false);

    /*
    * This method fetch past 7 days job
    * I assume that there is a payload with name {postedDate} that gives a response of last 7 days  
    */
    const getPastWeekJob = () => {

        //Updating past seven days filter state
        setPastWeekFilterActive(true);
        //showing loading screen
        updateLoading(true);

        //fetching jobs from API
        axios.post(apiUrl, { postedDate: "7d", ...data }).then(res => {
            setMyJobs(res.data.jobs);
            updateLoading(false);
        });
    }

    /*
    * This method is used to clear applied filter
    */
    const clearAppliedFilter = () => {
        //Updating all filter state
        setPastWeekFilterActive(false);
        setCompanyNameFilterActive(false);
        setMyJobs(jobList.jobs);
    }

    return (
        <div>
            <div className="container">
                <h1 className="page-heading">DEVELOPER JOBS NEAR ME</h1>
            </div>
            <hr />
            <div className="container">
                <Button className='ml-1' variant={pastWeekFilterActive ? "primary" : "secondary"} onClick={getPastWeekJob}>Past Week</Button>{' '}
                <Button variant={companyNameFilterActive ? "primary" : "secondary"} onClick={getPastWeekJob}>Company Name</Button>{' '}
                <Button variant="primary" onClick={clearAppliedFilter}>Clear</Button>
            </div>
            {
                //Showing loading if jobs are not fetched yet
                showLoading ? <Spinner /> : <JobList jobs={myJobs} cardLimit={cardLimit} textLimit={140} />
            }

        </div>
    )
}

/**
 * This method is used for server side rendering props fetch
 * 
 */
export async function getServerSideProps() {
    //Fetching job list from api
    const response = await axios.post(apiUrl, data);

    //Return job list as props
    return {
        props: {
            jobList: response.data
        }
    }
}

export default Jobs