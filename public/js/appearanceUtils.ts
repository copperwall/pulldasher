import $ from 'jquery'

export default {
   /** Hides/shows `blob` depending on whether `container` has any elements
    * matching `selector` in it. If it doesn't, then `blob` will be hidden,
    * and vice versa.
    *
    * @param selector The selector to use to find child nodes
    *
    * Contract: Is passed two jQuery objects.
    */
   hideIfEmpty: function(container, blob, selector) {
      if (container.find(selector).length > 0) {
         if (blob.hasClass('hidden')) {
            blob.removeClass('hidden');
         }
      } else {
         // Don't add an extra class if it's already there.
         if (!blob.hasClass('hidden')) {
            blob.addClass('hidden');
         }
      }
   },

   getAvatar: function(userid) {
      var avatar_url = 'https://avatars.githubusercontent.com/u/' + userid;
      var avatar = $('<img class="avatar">');
      avatar.attr('src', avatar_url);
      return avatar;
   },

   getCommentLink: function(pull, commentData) {
      var link =  $('<a target="_blank"></a>');
      var url = pull.url() + '#issuecomment-' + commentData.comment_id;
      link.attr('href', url);
      return link;
   },

   /**
    * Formats a date to be the first three characters of the month followed
    * by the day of the month. (Ex. "Oct 6")
    */
   formatDate: function(date) {
      return date.toLocaleDateString('en-us', {
         'month': 'short',
         'day': 'numeric'
      });
   },

   /**
    * Adds a tooltip containing information about an
    * action (such as CR or dev_block) on a pull. Does NOT activate the
    * tooltip; the user will need to call node.tooltip() to activate.
    */
   addActionTooltip: function(node, action, created_at, user) {
      var date = this.formatDate((new Date(created_at)));
      var info = [action, "on", date, 'by', user].join(" ");

      return this.addTooltip(node, info);
   },

   addTooltip: function(node, text, placement) {
      node.attr('data-toggle', "tooltip");
      node.attr('data-placement', placement);
      node.attr('title', text);

      node.tooltip();
      return node;
   },

   /**
    * Returns a boolean for if the given signature is by the currently logged-in user
    */
   mySig: function(signature) {
      return signature.data.user.login === App.user;
   }
};
