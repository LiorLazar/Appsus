export function MailAdvancedSearch({ isOpen }) {
    if (!isOpen) return null
    return (
        <div className="mail-advanced-search">
            <div className="advanced-search-form">
                <div className="form-row">
                    <label htmlFor="from">From</label>
                    <input type="text" name='from' id='from' />
                </div>

                <div className="form-row">
                    <label htmlFor="to">To</label>
                    <input type="text" name='to' id='to' />
                </div>

                <div className="form-row">
                    <label htmlFor="subject">Subject</label>
                    <input type="text" name='subject' id='subject' />
                </div>

                <div className="form-row">
                    <label htmlFor="includes">Includes the words</label>
                    <input type="text" name='includes' id='includes' />
                </div>

                <div className="form-row">
                    <label htmlFor="doesnt-have">Doesn't have</label>
                    <input type="text" name='doesnt-have' id='doesnt-have' />
                </div>

                <div className="form-row">
                    <label htmlFor="size">Size</label>
                    <div className="size-controls">
                        <select name="size-operator">
                            <option value="greater-than">greater than</option>
                            <option value="less-than">less than</option>
                        </select>
                        <input type="number" name='size-value' id='size-value' />
                        <select name="size-unit">
                            <option value="MB">MB</option>
                            <option value="KB">KB</option>
                            <option value="GB">GB</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <label htmlFor="date">Date within</label>
                    <div className="date-controls">
                        <select name="date-range">
                            <option value="1day">1 day</option>
                            <option value="3days">3 days</option>
                            <option value="1week">1 week</option>
                            <option value="2weeks">2 weeks</option>
                            <option value="1month">1 month</option>
                            <option value="2months">2 months</option>
                            <option value="6months">6 months</option>
                            <option value="1year">1 year</option>
                        </select>
                        <input type="date" name='specific-date' />
                    </div>
                </div>

                <div className="form-row">
                    <label htmlFor="search-in">Search</label>
                    <select name="search-in" id="search-in">
                        <option value="all-mail">All Mail</option>
                        <option value="inbox">Inbox</option>
                        <option value="sent">Sent Mail</option>
                        <option value="drafts">Drafts</option>
                        <option value="spam">Spam</option>
                        <option value="trash">Trash</option>
                    </select>
                </div>

                <div className="form-row checkbox-row">
                    <div className="checkbox-group">
                        <input type="checkbox" name="has-attachment" id="has-attachment" />
                        <label htmlFor="has-attachment">Has attachment</label>
                    </div>
                    <div className="checkbox-group">
                        <input type="checkbox" name="exclude-chats" id="exclude-chats" />
                        <label htmlFor="exclude-chats">Don't include chats</label>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="create-filter-btn">Create filter</button>
                    <button type="submit" className="search-btn">Search</button>
                </div>
            </div>
        </div>
    )
}