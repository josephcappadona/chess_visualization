def hash_params(params):
    ratingHash = hash(params['ratingRange'][0]) ^ hash(params['ratingRange'][1])
    themesHash = hash(params['themesOperator'])
    for theme in params['themes']:
        themesHash ^= hash(theme)
    openingsHash = 0
    for openingPair in params['openings']:
        openingsHash ^= hash(tuple(openingPair))
    return ratingHash ^ themesHash ^ openingsHash