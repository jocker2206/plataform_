import moment from 'moment';
import { clock } from '../../services/apis';
import BaseProvider from '../BaseProvider';

class ClockProvider extends BaseProvider  {

    collection = "config_assistances";

    index = async (query = {}, config = {}, ctx = null) => {
        query.page = typeof query.page != 'undefined' ? query.page : 1;
        query.year = typeof query.year != 'undefined' ? query.year : moment().year();
        query.month = typeof query.month != 'undefined' ? query.month : moment().month() + 1;
        let query_string = `page=${query.page}&year=${query.year}&month=${query.month}`;
        // request
        return await clock.get(`${this.collection}?${query_string}`, config, ctx)
            .then(res => res)
            .catch(err => this.handleError(err));
    }

    store = async (body = {}, config = {}, ctx = null) => {
        return await clock.post(`${this.collection}`, body, config, ctx)
        .then(res => res)
        .catch(err => this.handleError(err));
    }

    delete = async (id, body = {}, config = {}, ctx = null) => {
        return await clock.post(`${this.collection}/${id}?_method=DELETE`, body, config, ctx)
        .then(res => res)
        .catch(err => this.handleError(err));
    }

    assistances = async (id, query = {}, config = {}, ctx = null) => {
        query.page = typeof query.page != 'undefined' ? query.page : 1;
        query.query_search = typeof query.query_search != 'undefined' ? query.query_search : "";
        let query_string = `page=${query.page}&query_search=${query.query_search}`;
        return await clock.get(`${this.collection}/${id}/assistances?${query_string}`, config, ctx)
        .then(res => res)
        .catch(err => this.handleError(err));
    }

}

export default ClockProvider;