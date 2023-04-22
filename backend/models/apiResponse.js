module.exports = class ApiResponse {
    constructor(status, message, result, input, token, tag, description) {
        this.status = status;
        this.token = token;
        this.result = result;
        this.tag = tag;
        this.input = input;
        this.description = description;
        this.message = message
    }

    //Status 0 is for failure in API
    //Status 1 for success in API
    //Status 2 for Access Denied
    setStatus(StatusCode) {
        this.status = StatusCode;
    }

    setToken(Token) {
        this.token = Token;
    }

    setResult(Result) {
        this.result = Result;
    }

    setTag(Tag) {
        this.tag = Tag;
    }

    setInput(Input) {
        let body = JSON.parse(JSON.stringify(Input))
        if (body.authorisedUser) {
            delete body.authorisedUser
        }
        this.input = body;
    }

    setDescription(Description) {
        this.description = Description;
    }

    setMessage(Message) {
        this.message = Message;
    }

    getApiResponse() {
        return this;
    }
}